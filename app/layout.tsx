"use client";

import "./globals.css";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/sonner";
import i18n from "./i18n";
import { useLanguageDetector } from "@/lib/hooks/useLanguageDetector";
import ReactQueryClientProvider from "./providers/react-query-client-provider";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Change language base on browser's language
  useLanguageDetector();
  const pathName = usePathname();
  const noHeader = ["/auth/sign-in"]
    .includes(pathName);

  return (
    <html lang={i18n?.resolvedLanguage || "vi"}>
      <body
        className={`antialiased`}
      >
        <I18nextProvider i18n={i18n}>
          <ReactQueryClientProvider>
            <SessionProvider>
              {!noHeader && <Header />}
              {children}
              <Toaster />
            </SessionProvider>
          </ReactQueryClientProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
