"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote, Heart, ShieldCheck, Sparkles, MessageSquare } from "lucide-react";

interface ReviewItem {
  id: number;
  name: string;
  city: string;
  rating: number;
  date: string;
  product: string;
  category: "all" | "wafers" | "farali" | "khakhra";
  title: string;
  quote: string;
  highlight: string;
}

const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 1,
    name: "Ramesh Bhai Patel",
    city: "Surat",
    rating: 5,
    date: "Verified Buyer • 3 days ago",
    product: "Methi & Jeera Khakhra",
    category: "khakhra",
    title: "Brings back authentic traditional taste!",
    quote: "Super thin, perfectly roasted Khakhra. No synthetic spices or excessive oil. My morning tea session in Surat is simply incomplete without Pure Crunch Methi Khakhra. The crunch stays fresh for weeks!",
    highlight: "Traditional Clay Tava Taste"
  },
  {
    id: 2,
    name: "Priya Shah",
    city: "Ahmedabad",
    rating: 5,
    date: "Verified Buyer • 1 week ago",
    product: "Plain Salty Wafers",
    category: "wafers",
    title: "Zero oily residue & gentle on stomach",
    quote: "You can immediately smell and taste the difference pure groundnut oil makes! In commercial market brands, you get an oily coating in your throat. Pure Crunch wafers are light, airy, and gently salted with Sindhalu rock salt.",
    highlight: "100% Pure Groundnut Oil"
  },
  {
    id: 3,
    name: "Kavita Desai",
    city: "Rajkot",
    rating: 5,
    date: "Verified Buyer • 2 weeks ago",
    product: "Farali Chevdo & Farali Khakhra",
    category: "farali",
    title: "Best choice for Ekadashi & Upvas fasting",
    quote: "Finding 100% authentic fasting snacks prepared in pure groundnut oil without adulteration is very rare. The peanuts in Farali Chevdo are crispy, and the rock salt seasoning is perfectly balanced. Highly recommended for elders!",
    highlight: "100% Upvas Safe (Sindhalu Salt)"
  },
  {
    id: 4,
    name: "Dr. Nilesh Mehta",
    city: "Vadodara",
    rating: 5,
    date: "Verified Buyer • 3 weeks ago",
    product: "Masala Line Wafers",
    category: "wafers",
    title: "Heart-friendly snacking for the whole family",
    quote: "As a health-conscious physician, I strictly avoid commercial snacks made with cheap palm oil and hydrogenated fats. Pure Crunch's commitment to cold-pressed peanut oil with high MUFA & PUFA is a breath of fresh air.",
    highlight: "Zero Palm Oil & Zero Trans Fat"
  },
  {
    id: 5,
    name: "Jignesh Joshi",
    city: "Jamnagar",
    rating: 5,
    date: "Verified Buyer • 1 month ago",
    product: "Plain Masala Wafers",
    category: "wafers",
    title: "Crispy, fresh, and not overly spicy",
    quote: "The handpicked potatoes give these wafers an unbeatable golden crisp. Masala is aromatic rather than burning your tongue. Everyone in our family from grandchildren to grandparents devoured the packet in minutes!",
    highlight: "Handpicked Potatoes & Small Batches"
  },
  {
    id: 6,
    name: "Bhavna Ben Trivedi",
    city: "Bhavnagar",
    rating: 5,
    date: "Verified Buyer • 1 month ago",
    product: "Healthy Wheels & Fryums",
    category: "all",
    title: "Light evening snacks that kids love",
    quote: "Kids love fryums, but market varieties are fried in poor quality oil. These Pure Crunch wheels are crunchy, dry to the touch, and very easy on young digestive systems. We order a fresh batch every month via WhatsApp!",
    highlight: "Clean Artisan Frying"
  }
];

export function ReviewsSection() {
  const [filter, setFilter] = useState<"all" | "wafers" | "farali" | "khakhra">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const updateCards = () => {
      if (typeof window !== "undefined") {
        setCardsPerView(window.innerWidth < 768 ? 1 : 3);
      }
    };
    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  const filteredReviews = REVIEWS_DATA.filter(
    (r) => filter === "all" || r.category === filter
  );

  const maxIndex = Math.max(0, filteredReviews.length - cardsPerView);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-warm-bg/80 via-white to-warm-bg/40 border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 relative overflow-hidden">
        
        {/* Subtle decorative background quote */}
        <Quote className="w-32 h-32 text-primary/5 absolute -top-6 -right-6 pointer-events-none stroke-[2.5px]" />

        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-heading font-serif uppercase tracking-tight">
              Loved by Over 10,000+ Gujarati Families
            </h2>
            <p className="text-xs sm:text-sm text-muted font-semibold leading-relaxed">
              Real feedback from homes, tea gatherings, and festival celebrations where people chose 100% pure groundnut oil namkeen over commercial palm oil snacks.
            </p>
          </div>

          {/* Social Proof Aggregate Badge */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex items-center gap-4 flex-shrink-0 self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-amber-700 leading-none">4.9</span>
              <span className="text-[9px] font-bold text-amber-600 uppercase">/ 5.0</span>
            </div>
            <div>
              <div className="flex text-amber-400 gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs font-black text-heading">850+ Verified Reviews</p>
              <p className="text-[10px] text-muted font-medium">99.4% Customer Recommendation</p>
            </div>
          </div>
        </div>

        {/* Quality Pillars Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 pb-2 border-y border-gray-150 text-xs">
          <div className="flex items-center gap-2 text-heading font-bold">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-[11px]">100% Pure Peanut Oil</span>
          </div>
          <div className="flex items-center gap-2 text-heading font-bold">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-[11px]">Zero Palm Oil &amp; Trans Fat</span>
          </div>
          <div className="flex items-center gap-2 text-heading font-bold">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-[11px]">Mineral Rock Salt (Sindhalu)</span>
          </div>
          <div className="flex items-center gap-2 text-heading font-bold">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-[11px]">Light &amp; Gentle Digestion</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-muted uppercase mr-1">Filter by snack:</span>
            {[
              { id: "all", label: "All Reviews" },
              { id: "wafers", label: "Potato Wafers" },
              { id: "farali", label: "Farali Upvas Specials" },
              { id: "khakhra", label: "Traditional Khakhra" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilter(tab.id as any);
                  setCurrentIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  filter === tab.id
                    ? "bg-gradient-to-r from-[#009fe3] to-[#0284c7] text-white shadow-sm shadow-cyan-500/30"
                    : "bg-white text-heading border border-slate-200 hover:border-primary/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Navigation Buttons for Carousel */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-gray-200 bg-white hover:bg-slate-50 text-heading transition shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              title="Previous Review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-muted px-1">
              {currentIndex + 1} / {maxIndex + 1}
            </span>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-gray-200 bg-white hover:bg-slate-50 text-heading transition shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              title="Next Review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Reviews Display (Smooth Sliding Carousel Track) */}
        <div 
          className="overflow-hidden w-full pt-2 select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform -mx-3"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                style={{ width: `${100 / cardsPerView}%` }}
                className="flex-shrink-0 px-3 flex flex-col"
              >
                <div className="h-full bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 relative group">
                  <div className="space-y-3">
                    {/* Top card bar: Stars + Product tag */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
                        {rev.highlight}
                      </span>
                    </div>

                    {/* Review Title */}
                    <h4 className="text-sm font-black text-heading font-serif leading-snug">
                      &ldquo;{rev.title}&rdquo;
                    </h4>

                    {/* Review Body */}
                    <p className="text-xs text-body leading-relaxed font-medium text-gray-700">
                      {rev.quote}
                    </p>
                  </div>

                  {/* Reviewer Details Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        {rev.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-heading">{rev.name}</span>
                          <span title="Verified Customer" className="inline-flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          </span>
                        </div>
                        <span className="text-[11px] text-muted font-medium block">
                          {rev.city}, Gujarat • <span className="text-heading font-bold">{rev.product}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-1.5 pt-3">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentIndex ? "w-8 bg-gradient-to-r from-[#009fe3] to-[#f58220]" : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Jump to review slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
