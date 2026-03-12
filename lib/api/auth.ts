import { SignInRequestDto, SignUpRequestDto } from "@/app/types/auth";
import axiosInstanceAuth from "../axios-instance-auth";

export async function logIn(payload: SignInRequestDto) {
    try {
        const response = await axiosInstanceAuth.post("/login", payload);
        
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function register(payload: SignUpRequestDto) {
    try {
        const response = await axiosInstanceAuth.post("/register", payload);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function refresh(payload: { refreshToken: string }) {
    try {
        const response = await axiosInstanceAuth.post("/refresh", payload);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function logOut(payload: { refreshToken: string }) {
    try {
        const response = await axiosInstanceAuth.post("/logout", payload);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}