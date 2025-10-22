import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import { I18nProvider } from "@/components/providers";
import Footer from "@/components/footer";
import CookieBanner from "@/components/cookie-banner";
import { CartProvider } from "@/context/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vina Ramljak",
  description: "Vina Ramljak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" className="overscroll-none">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <I18nProvider>
          <CartProvider>
            <CookieBanner />
            <Navigation />
            {children}
            <Footer />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
