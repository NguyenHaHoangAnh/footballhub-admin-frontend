import NextAuth, { type NextAuthConfig } from "next-auth";
import 'next-auth/jwt'
import providers from "./auth-provider";

declare module 'next-auth' {
    interface Session {
        info: any,
        accessToken: string
        refreshToken?: string
    }

    interface User {
        info: Object,
        accessToken: string
        refreshToken?: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string
        refreshToken?: string
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
        if (user)
            return {
                ...token,
                info: user.info,
                accessToken: user.accessToken,
            }

            return token
        },

        async session({ token, session }) {
            if (token.accessToken) {
                session.info = token.info;
                session.accessToken = token.accessToken;
            }
            return session
        },
    },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);