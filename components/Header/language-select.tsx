"use client";

import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { IMAGE_FALLBACK } from "@/lib/constant";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function LanguageSelect() {
    const { t, i18n } = useTranslation(["common"]);
    const LANGUAGES: Record<string, { label: string; value: string; flagUrl: string }> = {
        vi: { label: t("common:language.vi"), value: "vi", flagUrl: "/images/flags/vi-flag.webp" },
        en: { label: t("common:language.en"), value: "en", flagUrl: "/images/flags/en-flag.webp" },
    }
    const [language, setLanguage] = useState(i18n?.resolvedLanguage || "vi");

    useEffect(() => {
        handleChangeLanguage(language);
    }, []);

    const handleChangeLanguage = (language: string) => {
        localStorage.setItem("lang", language);
        i18n.changeLanguage(language);
        setLanguage(language);
    }

    return (
        <Select 
            value={language} 
            onValueChange={handleChangeLanguage}
        >
            <SelectTrigger className="[&>.lucide-chevron-down]:hidden">
                <Image 
                    src={LANGUAGES[i18n?.resolvedLanguage || "vi"]?.flagUrl || IMAGE_FALLBACK.flag}
                    alt={i18n?.resolvedLanguage || "vi"}
                    width={32}
                    height={24}
                    className="rounded-sm"
                />
            </SelectTrigger>
            <SelectContent className="bg-white">
                {Object.entries(LANGUAGES).map(([key, value]) => (
                    <SelectItem
                        key={key}
                        value={value.value}
                        
                    >
                        <div className="flex items-center gap-2">
                            <Image 
                                src={value.flagUrl || IMAGE_FALLBACK.flag}
                                alt={value.value || "vi"}
                                width={32}
                                height={24}
                                className="rounded-sm"
                            />
                            <div>{value.label}</div>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}