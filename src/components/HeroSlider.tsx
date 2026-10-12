"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Slide {
  id: number;
  imageSrc: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
}

export const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1,
    imageSrc: "/hero_slides/slide_1.jpg",
    title: "100% Pure Groundnut Oil Wafers",
    subtitle: "Seasoned with mineral-rich rock salt (Sindhalu) for light, heart-healthy snacking.",
    buttonText: "Shop Wafers",
    link: "/products?category=Wafers"
  },
  {
    id: 2,
    imageSrc: "/hero_slides/slide_2.jpg",
    title: "Traditional Farali Specials",
    subtitle: "Fasting-safe treats like Pure Potato wafers prepared with pure ingredients.",
    buttonText: "Explore Farali",
    link: "/products?category=Farali+Specials"
  },
  {
    id: 3,
    imageSrc: "/hero_slides/slide_3.jpg",
    title: "Hand-Roasted Wheat Khakhra",
    subtitle: "Toasted on traditional clay tavas in small batches for authentic crunch.",
    buttonText: "Shop Khakhra",
    link: "/products?category=Khakhra"
  }
];

interface HeroSliderProps {
  initialSlides?: Slide[];
}

export function HeroSlider({ initialSlides }: HeroSliderProps = {}) {
  const [slides, setSlides] = useState<Slide[]>(
    initialSlides && initialSlides.length > 0 ? initialSlides : DEFAULT_SLIDES
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sync if initialSlides changes from parent
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      setSlides(initialSlides);
    }
  }, [initialSlides]);

  // Fetch dynamic hero slides saved from Admin Panel with no cache
  useEffect(() => {
    fetch("/api/hero", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.slides) && data.slides.length > 0) {
          setSlides(data.slides);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch dynamic hero slides:", err);
      });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoplay, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section 
      className="relative w-full h-[65vh] sm:h-[80vh] overflow-hidden select-none bg-slate-900"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides wrapper */}
      <div className="w-full h-full relative">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image & Vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent z-10" />
            <Image
              src={s.imageSrc}
              alt={s.title}
              fill
              priority={index === 0}
              unoptimized={Boolean(s.imageSrc?.startsWith("data:"))}
              className="object-cover w-full h-full brightness-90"
              sizes="100vw"
            />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-white space-y-4 md:space-y-6 animate-fade-in-up">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-[#009fe3] to-[#0284c7] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full inline-block shadow-md shadow-cyan-500/20 border border-white/20">
                    Pure Crunch Healthy Namkeen
                  </span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none font-serif text-white drop-shadow-md">
                    {s.title}
                  </h1>
                  <p className="text-sm sm:text-lg text-slate-100 font-medium leading-relaxed drop-shadow-sm">
                    {s.subtitle}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={s.link}
                      className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-[#f58220] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/30 transition transform active:scale-95 cursor-pointer"
                    >
                      {s.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-90 cursor-pointer hidden sm:flex"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-90 cursor-pointer hidden sm:flex"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? "bg-secondary scale-110 w-6" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
