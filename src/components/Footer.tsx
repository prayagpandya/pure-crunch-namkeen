"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/data/config";
import { Logo } from "./Logo";
import { Send, MapPin, Phone, Mail, Instagram, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  const pathname = usePathname();

  // Remove footer from admin authentication and admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing to Pure Crunch newsletters!");
  };

  return (
    <footer className="bg-[#0b132b] text-white pt-16 pb-8 z-10 relative">
      {/* 3-Color Brand Gradient Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#009fe3] via-[#f58220] to-[#65a30d]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="space-y-6">
            <Logo variant="footer" />
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {SITE_CONFIG.aboutShort}
            </p>
            
            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#f58220]">Stay Connected</h4>
              <div className="relative flex">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/15 rounded-full px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#009fe3] transition"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-gradient-to-r from-[#f58220] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] p-1.5 rounded-full text-white transition cursor-pointer shadow-sm shadow-orange-500/30"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#009fe3] border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-400 font-semibold">
              <li>
                <Link href="/" className="hover:text-primary transition">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition">Shop All Snacks</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition">Our Heritage Story</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">Contact Us</Link>
              </li>
              <li className="pt-1">
                <Link href="/admin" className="text-gray-500 hover:text-secondary text-[11px] transition inline-flex items-center gap-1 font-medium">
                  <span>🔒 Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#009fe3] border-b border-white/10 pb-2">
              Snack Categories
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-400 font-semibold">
              <li>
                <Link href="/products?category=Wafers" className="hover:text-primary transition">Potato Wafers</Link>
              </li>
              <li>
                <Link href="/products?category=Namkeen" className="hover:text-primary transition">Premium Namkeen</Link>
              </li>
              <li>
                <Link href="/products?category=Khakhra" className="hover:text-primary transition">Traditional Khakhra</Link>
              </li>
              <li>
                <Link href="/products?category=Fryums+%26+Wheels" className="hover:text-primary transition">Fryums & Wheels</Link>
              </li>
              <li>
                <Link href="/products?category=Farali+Specials" className="hover:text-green-400 transition flex items-center gap-1">
                  🌱 Farali Specials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#009fe3] border-b border-white/10 pb-2">
              Visit / Contact Us
            </h3>
            <ul className="space-y-3.5 text-xs text-gray-400 font-medium">
              <li className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={`tel:${SITE_CONFIG.whatsappNumber}`} className="hover:text-primary transition">
                  {SITE_CONFIG.phoneNumberDisplay}
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-primary transition truncate">
                  {SITE_CONFIG.email}
                </a>
              </li>
              
              {/* Social Media Link */}
              <li className="pt-2 flex items-center gap-3">
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 hover:bg-primary/20 hover:text-white rounded-full text-gray-400 transition"
                  title="Follow us on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 hover:bg-green-500/20 hover:text-[#25D366] rounded-full text-gray-400 transition"
                  title="Contact WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* FSSAI & Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* FSSAI Badge */}
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
            <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0" />
            <div className="text-[10px] text-gray-400 font-semibold leading-tight">
              FSSAI LICENSED KITCHEN
              <span className="block text-white font-extrabold tracking-wider font-mono">
                Lic No: {SITE_CONFIG.fssaiLicense}
              </span>
            </div>
          </div>

          {/* Copyrights */}
          <div className="text-center md:text-right space-y-1 font-semibold text-[11px] text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} {SITE_CONFIG.companyName}. All rights reserved.
            </p>
            <p>
              Handcrafted in Rajkot, Gujarat. Built with ❤️ for healthy family snacking.
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}
