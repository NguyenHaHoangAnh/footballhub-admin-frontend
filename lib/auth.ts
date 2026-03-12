import NextAuth, { type NextAuthConfig } from "next-auth";
import 'next-auth/jwt'
import providers from "./auth-provider";

declare module 'next-auth' {
    interface Session {
        info: any,
        accessToken: string | null,
        refreshToken: string,
    }

    interface User {
        info: Object,
        accessToken: string | null,
        refreshToken: string,
        expiredAt: number,
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string | null,
        refreshToken: string,
        expiredAt: number,
    }
}

async function refreshAccessToken(token: any) {
    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/refresh`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        const res = await response.json();

        if (!response.ok) {
            return {
                ...token,
                accessToken: null,
            };
        }

        return {
            ...token,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken ?? token.refreshToken,
            expiredAt: res.expiredAt,
        };
    } catch (error) {
        // console.error("[Error refreshing access token]", error);
        return {
            ...token,
            accessToken: null,
        };
    }
}

export const authConfig: NextAuthConfig = {
    providers: providers,
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            // Lần đầu login
            if (user) {
                return {
                    ...token,
                    info: user.info,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    expiredAt: user.expiredAt,
                }
            }

            // Nếu access token chưa hết hạn
            if (token.expiredAt && Date.now() < token.expiredAt) {
                return token;
            }

            return await refreshAccessToken(token);
        },

        async session({ token, session }) {
            if (token.accessToken) {
                session.info = token.info;
                session.accessToken = token.accessToken;
                session.refreshToken = token.refreshToken;
            }
            return session
        },
    },
}

// Mấy cái này chỉ dùng tại server side, client side dùng signIn/signOut của next-auth/react
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);