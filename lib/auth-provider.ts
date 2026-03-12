import CredentialsProvider from "next-auth/providers/credentials";

const credential = CredentialsProvider({
    id: "credentials",
    name: "Credentials",
    credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: credentials?.username,
                    password: credentials?.password,
                }),
            });

            const user = await res.json();

            if (res.ok && user.accessToken) {
                return {
                    id: user.info.userId,
                    info: user.info,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    expiredAt: user.expiredAt,
                };
            }
            return null;
        } catch (error) {
            console.error("Login error:", error);
            return null;
        }
    },
});

const providers = [credential];

export default providers;