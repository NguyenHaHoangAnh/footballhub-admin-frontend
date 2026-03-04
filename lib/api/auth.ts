import { SignInRequestDto, SignUpRequestDto } from "@/app/types/auth";
import axiosInstanceAuth from "../axios-instance-auth";

export async function signIn(payload: SignInRequestDto) {
    try {
        const response = await axiosInstanceAuth.post("/login", payload);
        
        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function signUp(payload: SignUpRequestDto) {
    try {
        const response = await axiosInstanceAuth.post("/register", payload);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

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

export async function signOut() {
    try {
        const response = await axiosInstanceAuth.post("/logout", {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}