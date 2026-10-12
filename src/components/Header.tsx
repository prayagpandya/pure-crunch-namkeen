"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { SITE_CONFIG } from "@/data/config";
import { MobileDrawer } from "./MobileDrawer";
import { CartDrawer } from "./CartDrawer";
import { Logo } from "./Logo";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface NavItem {
  name: string;
  href: string;
  isActive: (pathname: string, category: string | null) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Home",
    href: "/",
    isActive: (pathname) => pathname === "/",
  },
  {
    name: "Shop All",
    href: "/products",
    isActive: (pathname, category) =>
      pathname.startsWith("/products") &&
      category?.toLowerCase() !== "wafers" &&
      category?.toLowerCase() !== "namkeen",
  },
  {
    name: "Wafers",
    href: "/products?category=Wafers",
    isActive: (pathname, category) =>
      pathname.startsWith("/products") && category?.toLowerCase() === "wafers",
  },
  {
    name: "Namkeen",
    href: "/products?category=Namkeen",
    isActive: (pathname, category) =>
      pathname.startsWith("/products") && category?.toLowerCase() === "namkeen",
  },
  {
    name: "Our Story",
    href: "/about",
    isActive: (pathname) => pathname === "/about",
  },
  {
    name: "Contact",
    href: "/contact",
    isActive: (pathname) => pathname === "/contact",
  },
];

function HeaderNavContent({ pathname, category }: { pathname: string; category: string | null }) {
  return (
    <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-black text-xs lg:text-sm uppercase tracking-wider">
      {NAV_ITEMS.map((item) => {
        const active = item.isActive(pathname, category);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`py-2 relative transition-colors duration-200 ${
              active
                ? "text-primary font-black after:w-full after:h-[2.5px] after:bg-primary after:rounded-full"
                : "text-heading hover:text-primary after:w-0 hover:after:w-full after:h-0.5 after:bg-primary"
            } after:content-[''] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

function HeaderNavWithParams({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  return <HeaderNavContent pathname={pathname} category={category} />;
}

function DesktopNavbar() {
  const pathname = usePathname();
  return (
    <Suspense fallback={<HeaderNavContent pathname={pathname} category={null} />}>
      <HeaderNavWithParams pathname={pathname} />
    </Suspense>
  );
}

export function Header() {
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  // Sticky header class trigger on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Brand Announcement Bar */}
      <div className="bg-gradient-to-r from-[#009fe3] via-[#0284c7] to-[#f58220] text-white py-1.5 px-4 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center relative z-50 flex items-center justify-center gap-2 sm:gap-4 shadow-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>100% Pure Groundnut Oil</span>
        </span>
        <span className="opacity-60 hidden sm:inline">•</span>
        <span className="hidden sm:inline">Zero Palm Oil &amp; Hydrogenated Fats</span>
        <span className="opacity-60 hidden md:inline">•</span>
        <span className="hidden md:inline">Mineral-Rich Sindhalu Salt</span>
        <span className="opacity-60 hidden lg:inline">•</span>
        <span className="hidden lg:inline">अच्छा खाओ, अच्छा खिलाओ</span>
      </div>

      {/* Main Navbar */}
      <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-150/80 transition-all duration-300 ${
        isSticky ? "shadow-md py-1" : "py-2 sm:py-3"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            
            {/* Left: Burger Menu (Mobile) or Logo (Desktop) */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-heading transition active:scale-95 cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo */}
              <Logo variant="header" className="origin-left" />
            </div>

            {/* Center: Desktop Navigation Links */}
            <DesktopNavbar />

            {/* Right: Search, Account, Wishlist, Cart */}
            <div className="flex items-center gap-1.5 sm:gap-3 text-heading">
              
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-full hover:bg-slate-100 text-heading transition flex items-center justify-center cursor-pointer"
                title="Search snacks"
              >
                <Search className="w-5.5 h-5.5" />
              </button>

              {/* Direct WhatsApp Callout link */}
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full hover:bg-green-50 text-[#25D366] hover:text-[#20ba59] transition flex items-center justify-center max-sm:hidden"
                title="WhatsApp Inquiry"
              >
                <WhatsAppIcon className="w-5.5 h-5.5" />
              </a>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 rounded-full hover:bg-slate-100 text-heading transition relative flex items-center justify-center cursor-pointer group"
                title="Open Cart"
              >
                <ShoppingBag className="w-5.5 h-5.5 group-hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-gradient-to-r from-[#f58220] to-[#ea580c] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm shadow-orange-500/40">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* Dropdown Search Overlay */}
        {isSearchOpen && (
          <div className="border-t border-gray-150 bg-white p-4 animate-in slide-in-from-top duration-200 shadow-sm relative z-30">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search pure groundnut oil wafers, khakhra, chevdo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-11 pr-24 py-3 rounded-full border border-gray-300 text-sm font-semibold text-heading focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                />
                <Search className="w-5 h-5 text-muted absolute left-4 top-3.5" />
                <div className="absolute right-2 top-1.5 flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-primary text-white font-black text-xs rounded-full hover:bg-primary-hover transition cursor-pointer"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1.5 text-muted hover:text-heading cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Drawers */}
      <MobileDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onOpenCart={() => setIsCartOpen(true)}
      />
      <CartDrawer />
    </>
  );
}
