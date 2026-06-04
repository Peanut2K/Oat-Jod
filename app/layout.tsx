import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import Navigation from "@/components/Navigation";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "บันทึกรายจ่าย | Expense Tracker",
  description: "ติดตามรายรับ-รายจ่ายส่วนตัวของคุณ",
  manifest: "/manifest.json",
  themeColor: "#22c55e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${sarabun.variable} font-sans`}>
        <LanguageProvider>
          <main className="max-w-lg mx-auto min-h-screen pb-20">
            {children}
          </main>
          <Navigation />
        </LanguageProvider>
      </body>
    </html>
  );
}
