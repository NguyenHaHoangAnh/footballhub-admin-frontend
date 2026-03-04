import { getAccessToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    if (!getAccessToken()) {
        redirect("/auth/sign-in");
    }

    return (
        <>{children}</>
    );
}