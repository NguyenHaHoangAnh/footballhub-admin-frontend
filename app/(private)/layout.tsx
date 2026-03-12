"use client";

import { SESSION_STATUS } from "@/lib/constant";
import { handleSignOut } from "@/lib/log-out";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === SESSION_STATUS.AUTHENTICATED && !session?.accessToken) {
            handleSignOut(session?.refreshToken);
        }
    }, [session, status]);

    return (
        <div className="mt-[70px]">
            <div>
                {children}
            </div>
        </div>
    );
}