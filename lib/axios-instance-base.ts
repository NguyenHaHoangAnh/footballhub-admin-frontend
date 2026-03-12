import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { handleSignOut } from "./log-out";

const axiosInstanceBase = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

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
        // Nếu lỗi 401, 403 -> đăng xuất + redirect sang signin
        if ([401, 403].includes(error?.response?.status)) {
            const session = await getSession();
            await handleSignOut(session?.info?.userId);
        }

        return Promise.reject(error);
    }
);

export default axiosInstanceBase;