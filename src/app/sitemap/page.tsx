import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { PRODUCTS, CATEGORIES, Product } from "@/data/products";
import clientPromise from "@/lib/mongodb";
import { 
  FileText, 
  Layers, 
  ShoppingBag, 
  Globe, 
  ExternalLink, 
  ChevronRight, 
  Home, 
  Info, 
  Phone, 
  ShieldCheck 
} from "lucide-react";

export const metadata: Metadata = {
  title: "HTML Sitemap | Pure Crunch Healthy Namkeen",
  description: "Complete sitemap of Pure Crunch products, categories, and company pages for www.purecrunch.co.in.",
  alternates: {
    canonical: "https://www.purecrunch.co.in/sitemap",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SitemapPage() {
  const baseUrl = "https://www.purecrunch.co.in";
  let products: Product[] = PRODUCTS;

  try {
    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const dbProducts = await db.collection("products").find({}).toArray();
    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts.map((p) => {
        const { _id, ...rest } = p;
        return rest as Product;
      });
    }
  } catch (err) {
    console.warn("MongoDB fetch in sitemap page fallback to static PRODUCTS:", err);
  }

  const staticPages = [
    { name: "Home", path: "/", desc: "Homepage with hero slider, explore range, quality standard & reviews", icon: Home, priority: "1.0" },
    { name: "Shop All Snacks", path: "/products", desc: "Complete catalog of groundnut oil wafers, namkeen, and khakhra", icon: ShoppingBag, priority: "0.9" },
    { name: "Our Heritage Story", path: "/about", desc: "Achyut Industries background, pure groundnut oil pledge, since 1989", icon: Info, priority: "0.8" },
    { name: "Contact & Inquiry", path: "/contact", desc: "Direct contact details, WhatsApp inquiry, and kitchen location in Rajkot", icon: Phone, priority: "0.8" },
    { name: "Shopping Cart", path: "/cart", desc: "Review bag items, quantity management, and WhatsApp checkout", icon: ShoppingBag, priority: "0.5" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0b132b] via-[#0f172a] to-[#1e3a8a] text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-widest">
            <Globe className="w-3.5 h-3.5" />
            <span>Domain Index • www.purecrunch.co.in</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-serif uppercase tracking-tight text-white leading-tight">
            Complete Website Sitemap
          </h1>

          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            Browse the comprehensive directory of all pages, categories, and artisan snacks crafted by Achyut Industries in Rajkot, Gujarat.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#009fe3] to-[#0284c7] text-white rounded-full text-xs font-black uppercase tracking-wider hover:shadow-lg transition active:scale-95 shadow-cyan-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>View Raw XML Sitemap (/sitemap.xml)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-black uppercase tracking-wider transition border border-white/20"
            >
              <span>View Robots.txt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Column 1: Main Pages */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#009fe3] border border-cyan-100 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-heading uppercase font-serif tracking-wide">Primary Pages</h2>
              <p className="text-[11px] text-muted font-medium">{staticPages.length} core URLs</p>
            </div>
          </div>

          <div className="space-y-3">
            {staticPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.path}
                  href={page.path}
                  className="group block p-3 rounded-xl border border-slate-100 hover:border-primary/40 hover:bg-slate-50/80 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-heading group-hover:text-primary transition-colors flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span>{page.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted">Priority: {page.priority}</span>
                  </div>
                  <p className="text-[11px] text-muted leading-snug">{page.desc}</p>
                  <span className="text-[10px] text-primary/80 font-mono block pt-0.5">{baseUrl}{page.path}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Column 2: Category Pages */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#f58220] border border-orange-100 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-heading uppercase font-serif tracking-wide">Category Filters</h2>
              <p className="text-[11px] text-muted font-medium">{CATEGORIES.length} collections</p>
            </div>
          </div>

          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const catCount = products.filter((p) => 
                cat.toLowerCase() === "farali specials" ? p.isFarali : p.category.toLowerCase() === cat.toLowerCase()
              ).length;
              const linkUrl = `/products?category=${encodeURIComponent(cat)}`;

              return (
                <Link
                  key={cat}
                  href={linkUrl}
                  className="group block p-3 rounded-xl border border-slate-100 hover:border-secondary/40 hover:bg-slate-50/80 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-heading group-hover:text-secondary transition-colors">
                      {cat === "Farali Specials" ? "🌱 " + cat : cat}
                    </span>
                    <span className="text-[10px] font-bold text-muted bg-slate-100 px-2 py-0.5 rounded-full">
                      {catCount} snacks
                    </span>
                  </div>
                  <span className="text-[10px] text-secondary font-mono block pt-0.5">{baseUrl}{linkUrl}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Column 3: Quality & Assurance Links */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-lime-50 text-[#65a30d] border border-lime-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-heading uppercase font-serif tracking-wide">Quality Assurances</h2>
              <p className="text-[11px] text-muted font-medium">Standards &amp; certifications</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-body">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
              <h3 className="font-black text-heading uppercase text-xs">100% Pure Groundnut Oil</h3>
              <p className="text-[11px] text-muted leading-relaxed">
                Zero palm oil, high MUFA/PUFA, cholesterol-friendly snacking in small batches.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
              <h3 className="font-black text-heading uppercase text-xs">Mineral Rock Salt (Sindhalu)</h3>
              <p className="text-[11px] text-muted leading-relaxed">
                Himalayan rock salt gentle on blood pressure and 100% Upvas/fasting compliant.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
              <h3 className="font-black text-heading uppercase text-xs">FSSAI Certified Kitchen</h3>
              <p className="text-[11px] text-muted leading-relaxed font-mono">
                License: 10725030000551 (Achyut Industries, Rajkot)
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Full Products Directory List */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-primary text-xs font-black uppercase tracking-widest block">
              Direct Product URLs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-heading font-serif uppercase tracking-tight">
              All Indexed Snack Products ({products.length})
            </h2>
          </div>
          <p className="text-xs text-muted font-semibold">
            Included in <span className="font-mono text-heading">sitemap.xml</span> with weekly change frequency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => {
            const productUrl = `/products/${p.id}`;
            return (
              <Link
                key={p.id}
                href={productUrl}
                className="group p-4 rounded-2xl border border-slate-150 hover:border-primary/50 hover:bg-slate-50/60 transition-all flex flex-col justify-between space-y-2 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                      {p.subcategory || p.category}
                    </span>
                    {p.isFarali && (
                      <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Farali
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-heading font-serif uppercase tracking-tight group-hover:text-primary transition-colors mt-0.5">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
                    {p.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-heading">
                  <span>₹{p.mrp.toFixed(2)} ({p.weight})</span>
                  <span className="text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
