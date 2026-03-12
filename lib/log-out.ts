import { signOut } from "next-auth/react";
import { logOut } from "./api/auth";

let isLoggingOut = false; // Biến cờ để tránh gọi nhiều lần

export async function handleSignOut(refreshToken?: string) {
    if (isLoggingOut) return;
    isLoggingOut = true;

    try {
        if (refreshToken) {
            await logOut({ refreshToken });
        }

        await signOut({ redirect: true, redirectTo: "/auth/sign-in" });
    } catch (error) {
        console.error("[logOut]", error);
    } finally {
        isLoggingOut = false;
    }
}