import axios from "axios";

const axiosInstanceAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_AUTH_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstanceAuth;