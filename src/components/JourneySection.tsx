"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Leaf
} from "lucide-react";

export function JourneySection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      id: 0,
      icon: Heart,
      title: "100% Cold-Pressed Groundnut Oil",
      badge: "Heart Healthy",
      subtitle: "High in Good MUFA & PUFA",
      description: "Unlike commercial wafers fried in cheap palm oil, Pure Crunch is crafted exclusively in 100% pure groundnut oil. Naturally rich in Vitamin E and antioxidants, it supports heart health, maintains good HDL cholesterol, and eliminates the heavy, oily aftertaste or acidity.",
      bullets: [
        "Zero Palm Oil & Zero Hydrogenated Fats",
        "High MUFA & PUFA for healthy blood circulation",
        "Light on the stomach with easy digestion",
      ],
      tag: "Pure Kathiyawadi Tradition"
    },
    {
      id: 1,
      icon: Sparkles,
      title: "Handpicked Low-Moisture Potatoes",
      badge: "Farm Fresh",
      subtitle: "Specially Selected Slices",
      description: "Our signature potato wafers begin at sunrise in local Gujarat farms. We select low-sugar, high-density potatoes that are washed in cold pure water to remove excess starch. Cut to paper-thin precision, every wafer delivers a light, shattering crispness.",
      bullets: [
        "Specially graded for crispness and uniform golden color",
        "Slow cold-water wash removes excess starch",
        "Zero artificial coloring or chemical bleaching",
      ],
      tag: "Crunch in Every Bite"
    },
    {
      id: 2,
      icon: ShieldCheck,
      title: "Mineral-Rich Sindhalu (Rock Salt)",
      badge: "Fasting Safe",
      subtitle: "84 Natural Minerals",
      description: "We season our snacks using authentic Sindhalu (unrefined Himalayan pink rock salt) instead of regular industrial table salt. Gentle on blood pressure and naturally packed with essential minerals, making all our plain wafers 100% pure and safe for Upvas and fasting days.",
      bullets: [
        "100% Ekadashi, Navratri & festival fasting compliant",
        "Gentle on blood pressure and digestion",
        "Rich in essential natural trace electrolytes",
      ],
      tag: "100% Upvas Approved"
    },
    {
      id: 3,
      icon: Flame,
      title: "Small-Batch Artisan Kadhais",
      badge: "Slow Crafted",
      subtitle: "Frying in Controlled Batches",
      description: "Industrial snack factories pump oil continuously through mass fryers, degrading oil quality. At our Rajkot facility, we prepare snacks in small, calibrated kadhais with precise temperature control, ensuring the peanut oil never oxidizes or burns.",
      bullets: [
        "Temperature-calibrated frying preserves peanut nutrients",
        "No reheated burnt oil recirculated",
        "Hand-packed daily for maximum 90-day sealed freshness",
      ],
      tag: "Artisan Kitchen Standard"
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-warm-bg/40 relative overflow-hidden">
      {/* Subtle Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>The Pure Crunch Quality Standard</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-heading tracking-tight font-serif uppercase leading-tight">
            Crafted with Heart: The Purity of 100% Groundnut Oil
          </h2>

          <p className="text-xs sm:text-sm text-body font-semibold leading-relaxed max-w-2xl mx-auto">
            We went back to the traditional roots of authentic Gujarat snacking. No cheap commercial palm oil, no chemical preservatives — just pure farm ingredients fried to golden crispness in pure groundnut oil.
          </p>
        </div>

        {/* 4 Interactive Quality Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activeTab === pillar.id;

            // Brand accent mapping based on pillar
            const accentColor =
              pillar.id === 0
                ? "text-[#e11d48] bg-rose-50 border-rose-200"
                : pillar.id === 1
                ? "text-[#f58220] bg-orange-50 border-orange-200"
                : pillar.id === 2
                ? "text-[#009fe3] bg-cyan-50 border-cyan-200"
                : "text-[#65a30d] bg-lime-50 border-lime-200";

            return (
              <div
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`group bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 shadow-xl scale-[1.02]"
                    : "border-slate-200/90 hover:border-primary/40 shadow-xs hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {/* Top Icon & Badge */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${accentColor} ${
                      isSelected ? "scale-110 shadow-sm" : ""
                    }`}>
                      <Icon className="w-6 h-6 stroke-[2.2px]" />
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-heading">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-heading font-serif leading-snug group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-[11px] font-bold text-secondary mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted leading-relaxed font-semibold">
                    {pillar.description}
                  </p>
                </div>

                {/* Bullets List */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  {pillar.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] font-bold text-heading">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary font-bold">
                      • {pillar.tag}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality Guarantee Strip & CTA Buttons */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200 text-green-700 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-black text-heading uppercase tracking-wide">
                Our 100% Purity &amp; Freshness Guarantee
              </h4>
              <p className="text-xs text-muted font-semibold max-w-xl">
                Every packet of Pure Crunch is sealed fresh at our Rajkot facility with strict batch records. If you do not love the authentic groundnut oil crispness, we replace your packet with no questions asked.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
            <Link
              href="/products"
              className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md transition active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore All Snacks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-heading text-xs font-bold uppercase tracking-wider rounded-full transition active:scale-95 cursor-pointer"
            >
              Our Story &amp; Pledge
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
