"use client";

import { handleSignOut } from "@/lib/log-out";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();
    return (
        <header className="fixed top-0 left-0 px-10 py-[10px] w-full h-[70px] z-50 bg-white shadow-sm">
            {/* Logo */}
            {/* <Logo /> */}
            <Button onClick={() => handleSignOut(session?.refreshToken)}>
                Sign Out
            </Button>
        </header>
    )
}