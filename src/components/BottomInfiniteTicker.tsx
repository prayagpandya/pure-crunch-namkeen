"use client";

import React, { useState } from "react";
import { Sparkles, Droplet, Flame, ShieldCheck, Heart, X, ChevronUp } from "lucide-react";

export function BottomInfiniteTicker() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  const tickerItems = [
    { icon: Droplet, text: "100% PURE GROUNDNUT OIL", highlight: "ZERO PALM OIL" },
    { icon: Sparkles, text: "SINDHALU (ROCK SALT)", highlight: "EASY DIGESTION" },
    { icon: ShieldCheck, text: "SMALL BATCH CRAFTED", highlight: "RAJKOT HERITAGE" },
    { icon: Flame, text: "BLOCKBUSTER CRUNCH", highlight: "100% AUTHENTIC TASTE" },
    { icon: Heart, text: "HEALTHY NAMKEEN", highlight: "NO TRANS FAT" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="ml-4 mb-2 bg-primary text-white px-3 py-1.5 rounded-t-lg shadow-xl text-xs font-black flex items-center gap-1 hover:bg-primary-hover transition cursor-pointer"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span>Show Pure Crunch Ticker</span>
        </button>
      ) : (
        <div className="relative bg-gradient-to-r from-[#0b132b] via-[#0f172a] to-[#1e3a8a] text-white py-2.5 shadow-2xl border-t border-cyan-400/40 overflow-hidden flex items-center">
          
          {/* Marquee Content Container */}
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 py-0.5">
              
              {/* Loop twice for seamless infinite scrolling */}
              {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{item.text}</span>
                    <span className="bg-gradient-to-r from-[#f58220] to-[#ea580c] text-white text-[10px] px-2 py-0.5 rounded-full font-black tracking-normal shadow-xs">
                      {item.highlight}
                    </span>
                    <span className="text-white/30 ml-4">•</span>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Right Action Controls */}
          <div className="pr-3 pl-2 flex items-center gap-1 z-10 bg-slate-900/90 backdrop-blur-xs text-white">
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize Ticker"
              className="p-1 hover:bg-white/10 rounded-full transition text-slate-300 hover:text-white cursor-pointer"
            >
              <span className="text-[10px] font-bold uppercase px-1 hidden sm:inline">Minimize</span>
              <ChevronUp className="w-3.5 h-3.5 rotate-180" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              title="Close Ticker"
              className="p-1 hover:bg-black/5 rounded-full transition text-heading hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
