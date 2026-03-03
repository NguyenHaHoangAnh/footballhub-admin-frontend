import axios from "axios";

const axiosInstanceAuth = axios.create({
    baseURL: process.env.BACKEND_AUTH_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstanceAuth;