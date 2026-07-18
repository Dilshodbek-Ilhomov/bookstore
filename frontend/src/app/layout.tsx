import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { GlassNavbar } from "@/components/GlassNavbar";
import { PremiumFooter } from "@/components/PremiumFooter";
import { CartDrawer } from "@/components/CartDrawer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookStore | Read More, Grow More",
  description:
    "O'zbekistonning eng yaxshi onlayn kitob do'koni. Minglab kitoblarni kashf eting, o'qing va o'sing.",
  keywords: ["kitob", "bookstore", "o'zbek", "onlayn do'kon", "book-store.uz"],
  authors: [{ name: "BookStore" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "BookStore | Read More, Grow More",
    description:
      "O'zbekistonning eng yaxshi onlayn kitob do'koni. Minglab kitoblarni kashf eting.",
    url: "https://book-store.uz",
    siteName: "BookStore",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-[family-name:var(--font-geist)] antialiased">
        <SmoothScroll>
          <GlassNavbar />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <PremiumFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}

