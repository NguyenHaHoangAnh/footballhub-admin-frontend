"use client";

import Sidebar from "@/components/Sidebar";
import { SESSION_STATUS } from "@/lib/constant";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === SESSION_STATUS.AUTHENTICATED && !session?.accessToken) {
            signOut({ redirect: true, redirectTo: "/auth/sign-in" });
        }
    }, [session, status]);

    return (
        <div className="mt-17.5 flex">
            <Sidebar />
            <div className="p-5 w-full overflow-x-hidden">
                {children}
            </div>
        </div>
    );
}