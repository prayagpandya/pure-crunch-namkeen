"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface Category {
  id: number;
  name: string;
  image: string;
  link: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Potato Wafers",
    image: "/products/masala-line.jpg",
    link: "/products?category=Wafers",
    color: "bg-amber-50 hover:bg-amber-100/80 border-amber-200/60"
  },
  {
    id: 2,
    name: "Traditional Namkeen",
    image: "/products/farali-chevdo.jpg",
    link: "/products?category=Namkeen",
    color: "bg-red-50 hover:bg-red-100/80 border-red-200/60"
  },
  {
    id: 3,
    name: "Hand Roasted Khakhra",
    image: "/products/methi-khakhra.jpg",
    link: "/products?category=Khakhra",
    color: "bg-orange-50 hover:bg-orange-100/80 border-orange-200/60"
  },
  {
    id: 4,
    name: "Fasting Specials",
    image: "/products/mari-banana.jpg",
    link: "/products?category=Farali+Specials",
    color: "bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/60"
  },
  {
    id: 5,
    name: "Fryums & Wheels",
    image: "/products/masala-wheels.jpg",
    link: "/products?category=Fryums+%26+Wheels",
    color: "bg-purple-50 hover:bg-purple-100/80 border-purple-200/60"
  }
];

interface FeaturedCategoriesProps {
  initialCategories?: Category[];
}

export function FeaturedCategories({ initialCategories }: FeaturedCategoriesProps = {}) {
  const [categories, setCategories] = useState<Category[]>(
    initialCategories && initialCategories.length > 0 ? initialCategories : DEFAULT_CATEGORIES
  );

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  // Dynamic fetch with no-store cache to stay fresh with MongoDB
  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const prods = data.data;
          // Representative products from DB
          const waferProd =
            prods.find((p: any) => p.id === "masala-line") ||
            prods.find((p: any) => p.id === "salty-line") ||
            prods.find((p: any) => p.category === "Wafers" && p.id !== "plain-salty") ||
            prods.find((p: any) => p.category === "Wafers");
          const namkeenProd =
            prods.find((p: any) => p.id === "farali-chevdo") ||
            prods.find((p: any) => p.category === "Namkeen");
          const khakhraProd =
            prods.find((p: any) => p.id === "methi-khakhra") ||
            prods.find((p: any) => p.category === "Khakhra");
          const faraliProd =
            prods.find((p: any) => p.id === "mari-banana") ||
            prods.find((p: any) => p.isFarali && p.id !== "farali-chevdo") ||
            prods.find((p: any) => p.isFarali);
          const fryumsProd =
            prods.find((p: any) => p.id === "masala-wheels") ||
            prods.find((p: any) => p.category === "Fryums & Wheels");

          setCategories((prev) => [
            {
              ...prev[0],
              image: waferProd?.image || prev[0].image
            },
            {
              ...prev[1],
              image: namkeenProd?.image || prev[1].image
            },
            {
              ...prev[2],
              image: khakhraProd?.image || prev[2].image
            },
            {
              ...prev[3],
              image: faraliProd?.image || prev[3].image
            },
            {
              ...prev[4],
              image: fryumsProd?.image || prev[4].image
            }
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50/40 to-white relative overflow-hidden">
      {/* Decorative ambient subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest border border-primary/20">
            ✨ Munch Your Favorite
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-heading tracking-tight font-serif uppercase">
            Explore Our Range
          </h2>
          <p className="text-xs sm:text-sm text-body font-medium leading-relaxed">
            From crispy 100% pure groundnut oil wafers to traditional hand-roasted khakhra, discover the authentic taste of Rajkot.
          </p>
        </div>

        {/* Clean Modern Grid - NO CIRCLES BEHIND IMAGES */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 justify-center">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              className="group flex flex-col items-center text-center space-y-3.5"
            >
              {/* Product Image Card Container (No circle, clean elegant card) */}
              <div className="w-full aspect-square max-w-[200px] rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 p-2.5 sm:p-3 flex items-center justify-center relative overflow-hidden group-hover:-translate-y-2">
                {/* Subtle hover gradient backdrop */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    priority={cat.id <= 3}
                    unoptimized={Boolean(cat.image?.startsWith("data:"))}
                    className="object-contain drop-shadow-sm p-1"
                    sizes="(max-width: 768px) 45vw, 18vw"
                  />
                </div>
              </div>
              
              {/* Category Name & Indicator */}
              <div className="flex items-center justify-center gap-1.5 group-hover:text-primary transition-colors">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-heading font-serif group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
