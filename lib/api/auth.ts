import axiosInstanceAuth from "../axios-instance-auth";

export async function refreshAccessToken() {
    try {
        const response = await axiosInstanceAuth.post("/refresh", {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}