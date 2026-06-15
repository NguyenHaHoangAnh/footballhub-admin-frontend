"use client";

import { useTranslation } from "react-i18next";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import LanguageSelect from "./language-select";

export default function Header() {
    const { data: session } = useSession();
    const { t } = useTranslation(["common"]);

    return (
        <header className="fixed flex justify-between items-center top-0 left-0 px-8 py-[10px] w-full h-[70px] z-50 bg-white shadow-sm">
            {/* Logo */}
            <Logo />
            <div className="flex items-center gap-2">
                <LanguageSelect />
                <Button onClick={async () => await signOut({ redirect: true, redirectTo: "/auth/sign-in" })}>
                    {t("common:button.signOut")}
                </Button>
            </div>
        </header>
    )
}