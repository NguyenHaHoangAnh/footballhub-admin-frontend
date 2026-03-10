"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nextProvider } from "react-i18next";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import i18n from "./i18n";
import { useLanguageDetector } from "@/lib/hooks/useLanguageDetector";
import ReactQueryClientProvider from "./providers/react-query-client-provider";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
