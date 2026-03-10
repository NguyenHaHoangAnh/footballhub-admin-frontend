import axios from "axios";
import { refreshAccessToken } from "./api/auth";
import { getSession } from "next-auth/react";
import { signOut } from "./auth";

const axiosInstanceBase = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue: any[] = [];
let isRedirecting = false;

const processQueue = (error: any, accessToken: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(accessToken);
        }
    });

    failedQueue = [];
}

axiosInstanceBase.interceptors.request.use(
    // Add accessToken to headers
    async (config) => {
        config.headers["Accept-Language"] = "vi";
        const session = await getSession();

        if (session?.accessToken) {
            config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstanceBase.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;
        if (!config) return Promise.reject(error);
        // Nếu lỗi 401, 403 -> đăng xuất + redirect sang signin
        if ([401, 403].includes(error?.response?.status) && !config._retry) {
            if (config.url?.includes("/refresh")) {
                window.location.replace("/auth/sign-in");
                return Promise.reject(error);
            }

            // ví dụ:
            // accessToken hết hạn, refreshToken còn hạn
            // 1 page gọi 10 api -> 10 api 401
            // api 1 nhận 401, isRefreshing = false -> đánh dấu isRefreshing = true + gọi api /refresh
            // 9 api còn lại nhận 401, isRefreshing = true -> thêm vào hàng đợi -> đợi thằng đầu refresh xong mới retry

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then((accessToken) => {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                    return axiosInstanceBase(config);
                })
                .catch((error) => Promise.reject(error));
            }

            config._retry = true;
            isRefreshing = true;

            try {
                const response = await refreshAccessToken();
                const newAccessToken = response.data.accessToken;

                // Cập nhật lại next-auth session
                const session = await getSession();
                if (session) session.accessToken = newAccessToken;

                processQueue(null, newAccessToken);

                config.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return axiosInstanceBase(config);
            } catch (error) {
                processQueue(error, null);
                if (!isRedirecting) {
                    isRedirecting = true;
                    signOut({ redirect: true, redirectTo: "/auth/sign-in" });
                }
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstanceBase;