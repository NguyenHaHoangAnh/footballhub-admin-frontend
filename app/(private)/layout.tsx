import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    console.log("[accessToken]", session?.accessToken);
    
    if (!session?.accessToken) {
        redirect("/auth/sign-in");
    }

    return (
        <div className="mt-[70px]">
            <div>
                {children}
            </div>
        </div>
    );
}