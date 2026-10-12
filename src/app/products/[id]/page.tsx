"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, Product } from "@/data/products";
import { SITE_CONFIG } from "@/data/config";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { WhatsAppOrderModal } from "@/components/WhatsAppOrderModal";
import { 
  Star, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Award, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  X,
  PlusCircle,
  RefreshCw
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const staticMatch = useMemo(() => PRODUCTS.find((p) => p.id === id) || null, [id]);
  const [product, setProduct] = useState<Product | null>(staticMatch);
  const [loading, setLoading] = useState(!staticMatch);

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"ingredients" | "reviews" | "nutrition">("ingredients");
  
  // WhatsApp order modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Review submission state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  const [userReviews, setUserReviews] = useState(product?.reviews || []);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Fetch latest product details from MongoDB (with immediate fallback to static data)
  useEffect(() => {
    fetch(`/api/products/${id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProduct(data.data);
          setUserReviews(data.data.reviews || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Weight options: only 125g
  const weightOptions = ["125 g"];
  const [selectedWeight, setSelectedWeight] = useState("125 g");

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-heading font-black text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-primary" />
          <span>Loading snack details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  // Multiple product images list
  const productImages = useMemo(() => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Price for 125g pack
  const currentPrice = product.mrp;

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const addedReview = {
      id: `rev-${Date.now()}`,
      author: newReview.name,
      rating: newReview.rating,
      date: "Just now",
      comment: newReview.comment
    };

    setUserReviews([addedReview, ...userReviews]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setReviewSubmitted(false);
      setNewReview({ name: "", rating: 5, comment: "" });
    }, 1500);
  };

  const getDirectWhatsAppLink = () => {
    const text = `Namaste Pure Crunch team! 🙏\n\nI want to order *${product.name}* (${selectedWeight})\nQuantity: ${quantity}\nPrice: ₹${(currentPrice * quantity).toFixed(2)}\n\nPlease share payment and delivery details!`;
    return `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="py-8 md:py-16 bg-white animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs text-muted font-bold flex-wrap border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-primary transition">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-heading font-black font-serif uppercase tracking-tight">{product.name}</span>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Big Product Image Showcase & Multiple Photo Gallery */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-warm-bg/30 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center relative min-h-[350px] md:min-h-[450px] border border-gray-150 overflow-hidden">
              
              {/* Main Image */}
              <div className="w-full h-72 sm:h-96 relative">
                <Image
                  src={productImages[activeImageIndex] || product.image}
                  alt={`${product.name} - view ${activeImageIndex + 1}`}
                  fill
                  priority
                  unoptimized={Boolean((productImages[activeImageIndex] || product.image)?.startsWith("data:"))}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain p-2 transform hover:scale-105 transition duration-500"
                />
              </div>

              {/* Prev / Next Arrows if multiple images */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-heading shadow-md transition hover:scale-105 active:scale-95 cursor-pointer z-10"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % productImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-heading shadow-md transition hover:scale-105 active:scale-95 cursor-pointer z-10"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Fasting Badge */}
              {product.isFarali && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-green-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-sm">
                    🌱 Upvas Safe (Farali)
                  </span>
                </div>
              )}

              {/* Photo Indicator */}
              {productImages.length > 1 && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-charcoal/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {activeImageIndex + 1} / {productImages.length}
                  </span>
                </div>
              )}

              <div className="absolute bottom-4 right-4 z-10">
                <span className="bg-white/95 text-heading border border-gray-200 text-[10px] font-black px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-primary" />
                  <span>100% Pure Groundnut Oil</span>
                </span>
              </div>
            </div>

            {/* Thumbnail Row if Multiple Images */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 px-1">
                {productImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl relative overflow-hidden bg-warm-bg/40 border-2 transition duration-200 cursor-pointer flex-shrink-0 p-1 ${
                      activeImageIndex === idx
                        ? "border-primary ring-2 ring-primary/20 scale-102 bg-white"
                        : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.name} photo ${idx + 1}`}
                      fill
                      unoptimized={Boolean(imgUrl?.startsWith("data:"))}
                      sizes="(max-width: 640px) 64px, 80px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details Breakdown */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Category Pill & Rating Summary */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="bg-slate-100 text-body text-xs font-semibold px-3.5 py-1 rounded-full">
                    {product.subcategory}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-heading font-black">{product.rating}</span>
                  <span className="text-muted font-bold">({userReviews.length} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black text-heading font-serif uppercase tracking-tight leading-none">
                {product.name}
              </h1>

              {/* Price Display */}
              <div className="flex items-baseline gap-4 py-3">
                <span className="text-3xl font-black text-primary">
                  ₹{currentPrice.toFixed(2)}
                </span>
                <span className="text-xs text-muted font-bold">Inclusive of all taxes</span>
              </div>

              {/* Description */}
              <p className="text-sm text-body leading-relaxed font-semibold">
                {product.description}
              </p>

              {/* Sizing Weight Selection pills */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-heading block">Pack Weight:</span>
                <div className="flex flex-wrap gap-2.5">
                  {weightOptions.map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition transform active:scale-95 cursor-pointer ${
                        selectedWeight === weight
                          ? "bg-primary text-white shadow-md shadow-primary/10"
                          : "bg-slate-50 border border-gray-200 text-body hover:bg-warm-bg"
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature list */}
              <div className="flex flex-wrap gap-2 pt-4">
                {product.features.map((feat, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-warm-bg border border-primary/10 text-heading text-xs font-bold rounded-full"
                  >
                    <Check className="w-3.5 h-3.5 text-primary stroke-[3px]" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>

              {/* Fun Fact */}
              {product.funFact && (
                <div className="p-4 bg-warm-bg rounded-2xl border border-primary/10 space-y-1 mt-4">
                  <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span>Ek Fun Fact!</span>
                  </div>
                  <p className="text-xs font-bold text-heading leading-relaxed italic">
                    &ldquo;{product.funFact}&rdquo;
                  </p>
                </div>
              )}

            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-4 border-t border-gray-150 space-y-4">
              
              <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase tracking-wider text-heading">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-full p-1 bg-slate-50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 hover:bg-white rounded-full transition text-heading cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-black px-4 text-heading">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 hover:bg-white rounded-full transition text-heading cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => addToCart(product, selectedWeight, quantity)}
                  className="py-4 px-6 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-primary/10 flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-secondary" />
                  <span>Add to Cart (₹{(currentPrice * quantity).toFixed(2)})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(true)}
                  className="py-4 px-6 bg-[#25D366] hover:bg-[#1faa52] text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-green-500/10 flex items-center justify-center gap-2 transition transform active:scale-98 text-center cursor-pointer"
                >
                  <WhatsAppIcon className="w-4.5 h-4.5" />
                  <span>Order via WhatsApp</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Tabs: Ingredients / Reviews / Nutrition */}
        <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-xs space-y-6">
          
          <div className="flex items-center gap-6 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`text-xs sm:text-sm font-black pb-2 uppercase tracking-wider transition relative cursor-pointer ${
                activeTab === "ingredients"
                  ? "text-primary after:content-[''] after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-0.5 after:bg-primary"
                  : "text-muted hover:text-heading"
              }`}
            >
              Ingredients & Benefits
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`text-xs sm:text-sm font-black pb-2 uppercase tracking-wider transition relative cursor-pointer ${
                activeTab === "reviews"
                  ? "text-primary after:content-[''] after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-0.5 after:bg-primary"
                  : "text-muted hover:text-heading"
              }`}
            >
              Customer Reviews ({userReviews.length})
            </button>

            {product.nutritionInfo && (
              <button
                onClick={() => setActiveTab("nutrition")}
                className={`text-xs sm:text-sm font-black pb-2 uppercase tracking-wider transition relative cursor-pointer ${
                  activeTab === "nutrition"
                    ? "text-primary after:content-[''] after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-0.5 after:bg-primary"
                    : "text-muted hover:text-heading"
                }`}
              >
                Nutritional Values
              </button>
            )}
          </div>

          {/* Ingredients Tab */}
          {activeTab === "ingredients" && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-heading">Ingredients List</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-warm-bg text-heading font-bold text-xs rounded-xl border border-primary/10"
                  >
                    {ing}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-muted font-medium pt-2 leading-relaxed">
                Prepared under rigorous hygiene standards using cold-pressed groundnut oil, Handpicked Potato ,traditional spices, and mineral-rich Sindhalu rock salt. Contains zero hydrogenated oils or chemical preservatives.
              </p>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-heading">Verified Buyer Reviews</h3>
                  <p className="text-[11px] text-muted mt-0.5">Real customer reviews for {product.name}</p>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider rounded-full flex items-center gap-1 transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Write a Review</span>
                </button>
              </div>

              {userReviews.length === 0 ? (
                <p className="text-xs text-muted py-4 italic">No reviews yet. Be the first to share your feedback!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-slate-50/50 border border-gray-100 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-heading">{rev.author}</span>
                        <span className="text-[10px] text-muted">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-body leading-relaxed italic font-medium">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === "nutrition" && product.nutritionInfo && (
            <div className="max-w-sm border border-gray-150 rounded-2xl overflow-hidden text-xs">
              <div className="bg-warm-bg border-b border-gray-150 p-3.5 font-black text-heading uppercase tracking-wider">
                Nutritional Facts (Per 100g approx.)
              </div>
              <div className="divide-y divide-gray-150 p-3.5 space-y-2 font-semibold">
                <div className="flex justify-between py-1 text-body">
                  <span>Energy</span>
                  <span className="font-extrabold text-heading">{product.nutritionInfo.energy}</span>
                </div>
                <div className="flex justify-between py-1 text-body">
                  <span>Protein</span>
                  <span className="font-extrabold text-heading">{product.nutritionInfo.protein}</span>
                </div>
                <div className="flex justify-between py-1 text-body">
                  <span>Carbohydrates</span>
                  <span className="font-extrabold text-heading">{product.nutritionInfo.carbohydrates}</span>
                </div>
                <div className="flex justify-between py-1 text-body">
                  <span>Fat (Groundnut Oil)</span>
                  <span className="font-extrabold text-heading">{product.nutritionInfo.fat}</span>
                </div>
                <div className="flex justify-between py-1 text-body">
                  <span>Sodium (Sindhalu Salt)</span>
                  <span className="font-extrabold text-heading">{product.nutritionInfo.sodium}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-primary text-xs font-black uppercase tracking-wider block">
                  More Crunchy Delights
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-heading font-serif uppercase tracking-tight mt-0.5">
                  You May Also Like
                </h2>
              </div>
              <Link href="/products" className="text-xs font-black uppercase text-primary hover:text-primary-hover transition border-b border-primary/20 pb-0.5">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 px-4 md:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <div className="text-[10px] text-muted font-bold uppercase">{selectedWeight}</div>
          <div className="text-lg font-black text-primary">
            ₹{(currentPrice * quantity).toFixed(2)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => addToCart(product, selectedWeight, quantity)}
            className="px-4 py-2.5 bg-primary text-white font-black text-xs uppercase rounded-full shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-secondary" />
            <span>Add</span>
          </button>
          <a
            href={getDirectWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#25D366] text-white font-black text-xs uppercase rounded-full shadow-md flex items-center gap-1.5"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Review Modal popup */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsReviewModalOpen(false)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl z-10 space-y-4 border border-gray-150 animate-zoom-in">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-heading uppercase font-serif">Write a Review</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="p-1 text-muted hover:text-heading cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3px]" />
                </div>
                <h4 className="text-base font-black text-heading">Review Submitted!</h4>
                <p className="text-xs text-muted">Thank you for your valuable feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-heading mb-1 font-bold">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-heading mb-1 font-bold">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${star <= newReview.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-heading mb-1 font-bold">Review Comment *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How did you like the groundnut oil taste and Sindhalu rock salt seasoning?"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md transition cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* WhatsApp Customer Details & Order Modal */}
      {product && (
        <WhatsAppOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          items={[
            {
              name: product.name,
              weight: selectedWeight,
              quantity: quantity,
              price: currentPrice,
            },
          ]}
          totalAmount={currentPrice * quantity}
        />
      )}

    </div>
  );
}
