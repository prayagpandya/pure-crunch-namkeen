"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingBag, Heart, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, product.weight, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-full hover:-translate-y-1.5">
      
      {/* Fasting Friendly badge */}
      {product.isFarali && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            🌱 Farali Special
          </span>
        </div>
      )}

      {/* Wishlist Button Overlay */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-xs text-muted hover:text-primary transition active:scale-90 cursor-pointer border border-slate-100 ${
          isWishlisted ? "text-heart fill-heart border-rose-100 bg-rose-50" : ""
        }`}
        title="Add to Wishlist"
      >
        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
      </button>

      {/* Image Container with Hover Scale */}
      <div className="relative pt-6 px-4 pb-4 bg-gradient-to-b from-slate-50/80 to-white flex items-center justify-center min-h-[210px] overflow-hidden group-hover:from-cyan-50/30 transition-colors">
        <Link href={`/products/${product.id}`} className="w-full h-44 relative block">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized={Boolean(product.image?.startsWith("data:"))}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-110 drop-shadow-md"
          />
        </Link>
      </div>

      {/* Content details */}
      <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between gap-3 bg-white">
        <div>
          {/* Subcategory */}
          <div className="text-[10px] text-primary font-black uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>{product.subcategory}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm sm:text-base font-black text-heading group-hover:text-primary transition-colors line-clamp-2 font-serif uppercase tracking-tight">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? "fill-current"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted font-bold mt-0.5">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Cart CTA */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">{product.weight}</div>
            <div className="text-base sm:text-lg font-black text-heading">
              <span className="text-secondary text-sm">₹</span>{product.mrp.toFixed(2)}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1.5 transition transform active:scale-95 cursor-pointer ${
              isAdded 
                ? "bg-emerald-600 text-white shadow-emerald-600/30" 
                : "bg-gradient-to-r from-[#f58220] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white shadow-orange-500/25 shadow-md hover:shadow-lg"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
