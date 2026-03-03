// useLanguageDetector.ts

import { useEffect } from "react";
import i18n from "@/app/i18n";

export function useLanguageDetector() {
    useEffect(() => {
        const browserLang = navigator.language.split("-")[0];
        if (i18n.language !== browserLang) {
	        i18n.changeLanguage(browserLang);
        }
    }, []);
}