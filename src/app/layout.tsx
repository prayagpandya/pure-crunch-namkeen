import type { Metadata } from "next";
import { Outfit, Bree_Serif, Kalam } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const breeSerif = Bree_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

const kalam = Kalam({
  subsets: ["latin", "devanagari"],
  variable: "--font-hindi",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Pure Crunch | Healthy Namkeen & Crispy Wafers Online",
  description: "Shop premium Indian snacks cooked in 100% pure groundnut oil and seasoned with mineral-rich rock salt (Sindhalu). Healthy family snacking from Rajkot, Gujarat.",
  keywords: ["healthy namkeen", "potato wafers", "groundnut oil snacks", "rock salt wafers", "farali chevdo", "khakhra online", "achyut industries"],
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/images/favicon.ico",
    apple: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${breeSerif.variable} ${kalam.variable} h-full antialiasedScroll`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <CartProvider>
          <Header />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
