"use client";

import Logo from "../Logo";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 px-10 py-[10px] w-full h-[70px] z-50 bg-white shadow-sm">
            {/* Logo */}
            <Logo />
        </header>
    )
}