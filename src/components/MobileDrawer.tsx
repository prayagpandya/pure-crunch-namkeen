"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SITE_CONFIG } from "@/data/config";
import { CATEGORIES } from "@/data/products";
import { Logo } from "./Logo";
import { X, ChevronRight, Phone, ShoppingBag, MapPin, Award } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

function MobileDrawerContent({
  isOpen,
  onClose,
  onOpenCart,
  pathname,
  category,
}: MobileDrawerProps & { pathname: string; category: string | null }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden md:hidden animate-fade-in">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-80 max-w-[85vw] bg-white text-heading flex flex-col justify-between shadow-2xl animate-slide-in-left">
          
          {/* Top Bar */}
          <div className="p-4 border-b border-gray-150 flex items-center justify-between">
            <Logo variant="header" />
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-800 transition active:scale-95 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="flex items-center justify-center gap-2 p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold text-xs active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>My Cart</span>
              </button>

              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-green-500/10 text-green-600 border border-green-500/20 rounded-xl font-bold text-xs active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Main Links */}
            <div className="space-y-1">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted px-2 mb-2">
                Navigation
              </p>
              {(() => {
                const isHome = pathname === "/";
                const isShop = pathname.startsWith("/products") && (!category || category === "all");
                const isAbout = pathname === "/about";
                const isContact = pathname === "/contact";

                return (
                  <>
                    <Link 
                      href="/" 
                      onClick={onClose}
                      className={`flex items-center justify-between p-3 rounded-xl transition font-bold text-sm ${
                        isHome ? "bg-primary text-white font-black shadow-xs" : "hover:bg-warm-bg text-heading"
                      }`}
                    >
                      <span>Home</span>
                      <ChevronRight className={`w-4 h-4 ${isHome ? "text-white" : "text-muted"}`} />
                    </Link>
                    <Link 
                      href="/products" 
                      onClick={onClose}
                      className={`flex items-center justify-between p-3 rounded-xl transition font-bold text-sm ${
                        isShop ? "bg-primary text-white font-black shadow-xs" : "hover:bg-warm-bg text-heading"
                      }`}
                    >
                      <span>Shop All Snacks</span>
                      <ChevronRight className={`w-4 h-4 ${isShop ? "text-white" : "text-muted"}`} />
                    </Link>
                    <Link 
                      href="/about" 
                      onClick={onClose}
                      className={`flex items-center justify-between p-3 rounded-xl transition font-bold text-sm ${
                        isAbout ? "bg-primary text-white font-black shadow-xs" : "hover:bg-warm-bg text-heading"
                      }`}
                    >
                      <span>About Us</span>
                      <ChevronRight className={`w-4 h-4 ${isAbout ? "text-white" : "text-muted"}`} />
                    </Link>
                    <Link 
                      href="/contact" 
                      onClick={onClose}
                      className={`flex items-center justify-between p-3 rounded-xl transition font-bold text-sm ${
                        isContact ? "bg-primary text-white font-black shadow-xs" : "hover:bg-warm-bg text-heading"
                      }`}
                    >
                      <span>Contact Us</span>
                      <ChevronRight className={`w-4 h-4 ${isContact ? "text-white" : "text-muted"}`} />
                    </Link>
                  </>
                );
              })()}
            </div>

            {/* Categories */}
            <div className="space-y-1">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted px-2 mb-2">
                Categories
              </p>
              {CATEGORIES.filter(c => c !== "Shop All" && c !== "Farali Specials").map((cat) => {
                const isCatActive = pathname.startsWith("/products") && category?.toLowerCase() === cat.toLowerCase();
                return (
                  <Link
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    onClick={onClose}
                    className={`flex items-center justify-between p-2.5 px-3 rounded-xl transition text-xs ${
                      isCatActive
                        ? "bg-primary/10 text-primary font-black border border-primary/20"
                        : "hover:bg-warm-bg text-body font-semibold"
                    }`}
                  >
                    <span>{cat}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isCatActive ? "text-primary" : "text-muted"}`} />
                  </Link>
                );
              })}
              {(() => {
                const isFaraliActive = pathname.startsWith("/products") && (
                  category?.toLowerCase() === "farali specials" || 
                  category?.toLowerCase() === "farali+specials"
                );
                return (
                  <Link
                    href={`/products?category=Farali+Specials`}
                    onClick={onClose}
                    className={`flex items-center justify-between p-2.5 px-3 rounded-xl transition text-xs font-bold ${
                      isFaraliActive
                        ? "bg-green-100 text-green-800 font-black border border-green-300"
                        : "hover:bg-warm-bg text-green-700"
                    }`}
                  >
                    <span>🌱 Farali Specials</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isFaraliActive ? "text-green-800" : "text-green-600"}`} />
                  </Link>
                );
              })()}
            </div>

            {/* Brand Highlights */}
            <div className="p-4 bg-warm-bg rounded-2xl border border-primary/10 space-y-2">
              <div className="flex items-center gap-2 text-primary text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>100% Pure Groundnut Oil</span>
              </div>
              <p className="text-[11px] text-body leading-relaxed">
                Zero palm oil, zero trans fats. Prepared in small batches in Rajkot, Gujarat with rock salt (Sindhalu).
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-150 bg-warm-bg text-xs text-muted space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">{SITE_CONFIG.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{SITE_CONFIG.phoneNumberDisplay}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function MobileDrawerWithParams(props: MobileDrawerProps & { pathname: string }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  return <MobileDrawerContent {...props} category={category} />;
}

export function MobileDrawer(props: MobileDrawerProps) {
  const pathname = usePathname();
  if (!props.isOpen) return null;

  return (
    <Suspense fallback={<MobileDrawerContent {...props} pathname={pathname} category={null} />}>
      <MobileDrawerWithParams {...props} pathname={pathname} />
    </Suspense>
  );
}
