"use client";

import { SITE_CONFIG } from "@/data/config";
import { ShieldCheck, Heart, Droplet, Flame, Users, Leaf } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      
      {/* 1. Header Hero section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-primary text-xs font-black uppercase tracking-widest block">
          Our Heritage & Values
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-heading font-serif uppercase tracking-tight leading-none">
          Eat Good, Serve Good
        </h1>
        <p className="text-xs sm:text-sm font-hindi tracking-wide text-primary font-bold">अच्छा खाओ, अच्छा खिलाओ</p>
        <p className="text-sm text-body leading-relaxed font-semibold pt-2">
          {SITE_CONFIG.aboutText}
        </p>
      </div>

      {/* 2. Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission */}
        <div className="bg-warm-bg rounded-3xl p-6 sm:p-8 border border-primary/10 space-y-3 relative overflow-hidden">
          <Heart className="w-24 h-24 text-primary/5 absolute -right-4 -bottom-4" />
          <h3 className="text-lg font-black text-heading font-serif uppercase tracking-tight">Our Mission</h3>
          <p className="text-xs sm:text-sm text-body leading-relaxed font-semibold">
            To provide healthy, delicious, and high-quality snacks made with premium ingredients while maintaining traditional taste and uncompromising quality. We want to make snack time healthy again for every Indian household.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-warm-bg rounded-3xl p-6 sm:p-8 border border-primary/10 space-y-3 relative overflow-hidden">
          <Users className="w-24 h-24 text-primary/5 absolute -right-4 -bottom-4" />
          <h3 className="text-lg font-black text-heading font-serif uppercase tracking-tight">Our Vision</h3>
          <p className="text-xs sm:text-sm text-body leading-relaxed font-semibold">
            To become one of India&apos;s most trusted healthy snack brands by promoting better eating habits and delivering products that all families can enjoy every day. We envision a palm-oil free snacking ecosystem.
          </p>
        </div>

      </div>

      {/* 3. Staggered Quality Promises (Core values) */}
      <div className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-primary text-xs font-black uppercase tracking-widest block">
            Quality Commitments
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-heading font-serif uppercase tracking-tight">
            Our Quality Promises
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-4 hover:shadow-xs transition">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Droplet className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black uppercase text-heading">100% Pure Groundnut Oil</h4>
            <p className="text-[11px] text-body leading-relaxed font-semibold">
              Cooked exclusively in heart-friendly, premium groundnut oil with zero palm oil or trans fats.
            </p>
          </div>

          <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-4 hover:shadow-xs transition">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black uppercase text-heading">Farm-Fresh Red Potatoes</h4>
            <p className="text-[11px] text-body leading-relaxed font-semibold">
              Crafted from select low-moisture red potatoes that fry to a signature light, non-greasy crunch with rich natural flavor.
            </p>
          </div>

          <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-4 hover:shadow-xs transition">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black uppercase text-heading">Small Batch Frying</h4>
            <p className="text-[11px] text-body leading-relaxed font-semibold">
              Prepared in small artisan batches in Rajkot, Gujarat for maximum freshness and crunch.
            </p>
          </div>

          <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-4 hover:shadow-xs transition">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black uppercase text-heading">Zero Preservatives</h4>
            <p className="text-[11px] text-body leading-relaxed font-semibold">
              100% natural ingredients with authentic regional spices and aromatic herbs. No artificial colors.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
