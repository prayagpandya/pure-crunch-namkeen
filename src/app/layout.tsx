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
  metadataBase: new URL("https://www.purecrunch.co.in"),
  title: {
    default: "Pure Crunch | 100% Pure Groundnut Oil Healthy Namkeen & Wafers",
    template: "%s | Pure Crunch Healthy Namkeen",
  },
  description: "Shop premium Indian snacks cooked in 100% pure groundnut oil and seasoned with mineral-rich rock salt (Sindhalu). Healthy family snacking from Rajkot, Gujarat.",
  keywords: ["healthy namkeen", "potato wafers", "groundnut oil snacks", "rock salt wafers", "farali chevdo", "khakhra online", "achyut industries", "pure crunch rajkot"],
  alternates: {
    canonical: "https://www.purecrunch.co.in",
  },
  openGraph: {
    title: "Pure Crunch | Healthy Namkeen & Crispy Wafers",
    description: "Shop premium Indian snacks cooked in 100% pure groundnut oil with rock salt (Sindhalu). Zero palm oil.",
    url: "https://www.purecrunch.co.in",
    siteName: "Pure Crunch",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/main_logo.webp",
        width: 1200,
        height: 630,
        alt: "Pure Crunch Healthy Namkeen",
      },
    ],
  },
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
