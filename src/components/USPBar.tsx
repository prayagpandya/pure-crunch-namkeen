"use client";

import React from "react";
import { Lightbulb, Droplet, Zap, Package, Sparkles } from "lucide-react";

interface USPItem {
  id: number;
  title: string;
  icon: React.ReactNode;
}

export function USPBar() {
  const usps = [
    {
      id: 1,
      title: "100% Pure Groundnut Oil",
      badge: "Heart Healthy",
      icon: <Droplet className="w-5 h-5 text-[#009fe3] fill-[#009fe3]/20" />,
      color: "border-[#009fe3]/30 bg-cyan-50/50"
    },
    {
      id: 2,
      title: "Mineral-Rich Sindhalu",
      badge: "Rock Salt",
      icon: <Sparkles className="w-5 h-5 text-[#f58220]" />,
      color: "border-[#f58220]/30 bg-orange-50/50"
    },
    {
      id: 3,
      title: "100% Palm Oil Free",
      badge: "Zero Trans Fat",
      icon: <Droplet className="w-5 h-5 text-[#e11d48] fill-[#e11d48]/20" />,
      color: "border-[#e11d48]/30 bg-rose-50/50"
    },
    {
      id: 4,
      title: "Handmade Artisanal Crunch",
      badge: "Small Batch",
      icon: <Zap className="w-5 h-5 text-[#65a30d]" />,
      color: "border-[#65a30d]/30 bg-lime-50/50"
    },
    {
      id: 5,
      title: "Rajkot Heritage Tradition",
      badge: "Since 1989",
      icon: <Package className="w-5 h-5 text-[#1e3a8a]" />,
      color: "border-[#1e3a8a]/30 bg-indigo-50/50"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-r from-slate-50 via-cyan-50/20 to-orange-50/20 border-y border-slate-200/80 py-5 overflow-hidden relative">
      <div className="flex w-max gap-6 sm:gap-8 animate-marquee whitespace-nowrap">
        {/* Render list twice for a seamless infinite loop */}
        {[...usps, ...usps].map((item, idx) => (
          <div 
            key={`${item.id}-${idx}`} 
            className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-200 shadow-xs select-none hover:shadow-md transition-shadow"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${item.color}`}>
              {item.icon}
            </div>

            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-heading font-serif tracking-tight uppercase">
                {item.title}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-muted">
                {item.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
