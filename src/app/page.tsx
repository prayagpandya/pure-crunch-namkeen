import React from "react";
import Link from "next/link";
import { PRODUCTS, Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { HeroSlider, DEFAULT_SLIDES, Slide } from "@/components/HeroSlider";
import { FeaturedCategories, DEFAULT_CATEGORIES, Category } from "@/components/FeaturedCategories";
import { USPBar } from "@/components/USPBar";
import { JourneySection } from "@/components/JourneySection";
import { BottomInfiniteTicker } from "@/components/BottomInfiniteTicker";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ChevronRight, ArrowRight, Sparkles, ShieldCheck, Flame, BookOpen } from "lucide-react";
import Image from "next/image";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let slides: Slide[] = DEFAULT_SLIDES;
  let products: Product[] = PRODUCTS;

  try {
    const client = await clientPromise;
    const db = client.db("pure_crunch_db");

    const heroSetting = await db.collection("settings").findOne({ key: "hero_slides" });
    if (heroSetting && Array.isArray(heroSetting.slides) && heroSetting.slides.length > 0) {
      slides = heroSetting.slides as Slide[];
    }

    const dbProducts = await db.collection("products").find({}).toArray();
    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts.map((p) => {
        const { _id, ...rest } = p;
        return rest as Product;
      });
    }
  } catch (err) {
    console.warn("MongoDB fetch in HomePage fallback to static defaults:", err);
  }

  // Derive categories for FeaturedCategories
  const waferProd =
    products.find((p) => p.id === "masala-line") ||
    products.find((p) => p.id === "salty-line") ||
    products.find((p) => p.category === "Wafers" && p.id !== "plain-salty") ||
    products.find((p) => p.category === "Wafers");
  const namkeenProd =
    products.find((p) => p.id === "farali-chevdo") ||
    products.find((p) => p.category === "Namkeen");
  const khakhraProd =
    products.find((p) => p.id === "methi-khakhra") ||
    products.find((p) => p.category === "Khakhra");
  const faraliProd =
    products.find((p) => p.id === "mari-banana") ||
    products.find((p) => p.isFarali && p.id !== "farali-chevdo") ||
    products.find((p) => p.isFarali);
  const fryumsProd =
    products.find((p) => p.id === "masala-wheels") ||
    products.find((p) => p.category === "Fryums & Wheels");

  const categories: Category[] = [
    {
      id: 1,
      name: "Potato Wafers",
      image: waferProd?.image || "/products/masala-line.jpg",
      link: "/products?category=Wafers",
      color: "bg-amber-50 hover:bg-amber-100/80 border-amber-200/60"
    },
    {
      id: 2,
      name: "Traditional Namkeen",
      image: namkeenProd?.image || "/products/farali-chevdo.jpg",
      link: "/products?category=Namkeen",
      color: "bg-red-50 hover:bg-red-100/80 border-red-200/60"
    },
    {
      id: 3,
      name: "Hand Roasted Khakhra",
      image: khakhraProd?.image || "/products/methi-khakhra.jpg",
      link: "/products?category=Khakhra",
      color: "bg-orange-50 hover:bg-orange-100/80 border-orange-200/60"
    },
    {
      id: 4,
      name: "Fasting Specials",
      image: faraliProd?.image || "/products/mari-banana.jpg",
      link: "/products?category=Farali+Specials",
      color: "bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/60"
    },
    {
      id: 5,
      name: "Fryums & Wheels",
      image: fryumsProd?.image || "/products/masala-wheels.jpg",
      link: "/products?category=Fryums+%26+Wheels",
      color: "bg-purple-50 hover:bg-purple-100/80 border-purple-200/60"
    }
  ];

  // Filter popular products to show as bestsellers
  const bestsellers = products.filter((p) => p.isPopular).slice(0, 4);

  return (
    <div className="space-y-16 pb-24 relative overflow-hidden">
      
      {/* 1. Hero Banner Carousel */}
      <HeroSlider initialSlides={slides} />

      {/* 2. Featured Categories (Circles showcase) */}
      <FeaturedCategories initialCategories={categories} />

      {/* 3. Heritage Journey Timeline */}
      <JourneySection />

      {/* 4. Quality USP Bar */}
      <USPBar />

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-primary text-xs font-black uppercase tracking-widest block">
              Customer Favourites
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-heading tracking-tight font-serif uppercase mt-1">
              Our Bestselling Snacks
            </h2>
          </div>
          
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary hover:text-primary-hover transition border-b border-primary/20 pb-0.5"
          >
            <span>View All Snacks ({products.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Brand Story Highlight (Premium Dark Showcase) */}
      <section className="bg-gradient-to-br from-[#0b132b] via-[#0f172a] to-[#1e3a8a] text-white py-20 md:py-28 relative overflow-hidden">
        {/* Ambient brand color glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#009fe3]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#f58220]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif uppercase leading-tight drop-shadow-sm">
                The Pure Groundnut Oil Difference
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                At Achyut Industries, we believe snack time should enhance health, not compromise it. In response to rising heart health concerns caused by palm oil and hydrogenated fats, we craft our snacks using heart-friendly, 100% Pure Groundnut Oil and premium ingredients like Rock Salt (Sindhalu) in small artisan batches in Rajkot, Gujarat.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl mt-0.5 border border-cyan-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wide">100% Palm Oil Free</h4>
                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">We never use cheap palm oil or trans fats.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-xl mt-0.5 border border-orange-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wide">Mineral-Rich Sindhalu</h4>
                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">Mineral rock salt gentle on blood pressure.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#f58220] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/30 active:scale-95 transition cursor-pointer"
                >
                  <span>Our Health Pledge</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs font-bold text-slate-300 font-serif italic">
                  &ldquo;अच्छा खाओ, अच्छा खिलाओ&rdquo;
                </span>
              </div>
            </div>

            {/* Right Images grid (Floating Glass Preview) */}
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <div className="h-44 sm:h-64 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md relative overflow-hidden flex items-center justify-center shadow-lg hover:border-cyan-400/50 hover:bg-white/15 transition-all duration-300">
                  <Image src="/products/plain-salty.jpg" alt="Plain Salty Wafer packaging" fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-4 drop-shadow-md hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="h-40 sm:h-48 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md relative overflow-hidden flex items-center justify-center shadow-lg hover:border-cyan-400/50 hover:bg-white/15 transition-all duration-300">
                  <Image src="/products/methi-khakhra.jpg" alt="Methi Khakhra packaging" fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-4 drop-shadow-md hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-40 sm:h-48 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md relative overflow-hidden flex items-center justify-center shadow-lg hover:border-orange-400/50 hover:bg-white/15 transition-all duration-300">
                  <Image src="/products/farali-chevdo.jpg" alt="Farali Chevdo snack bowl" fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-4 drop-shadow-md hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="h-44 sm:h-64 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md relative overflow-hidden flex items-center justify-center shadow-lg hover:border-orange-400/50 hover:bg-white/15 transition-all duration-300">
                  <Image src="/products/masala-line.jpg" alt="Masala Line Wafer packaging" fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-4 drop-shadow-md hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Redesigned Customer Reviews Section */}
      <ReviewsSection />

      {/* 8. Health Corner / Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest border border-primary/20">
            📖 Health &amp; Snack Insights
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-heading tracking-tight font-serif uppercase">
            Hot &amp; Crispy Health Corner
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 space-y-4 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#009fe3] border border-cyan-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-wider">Health Guide</span>
            <h3 className="text-base sm:text-lg font-black text-heading leading-snug font-serif uppercase tracking-tight group-hover:text-primary transition duration-200">
              Why Pure Groundnut Oil is Superior for Heart Health
            </h3>
            <p className="text-xs text-muted leading-relaxed font-semibold">
              keeps the Heart Healthy by rich with high MUFA &amp; PUFA. which helps lower bad cholesterol LDL while maintaining good cholesterol HDL. Rich in Antioxidant, Vitamin E, Blood Sugar Control, Better Digestion.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-secondary/40 transition-all duration-300 space-y-4 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f58220] border border-orange-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-wider">Farm Fresh</span>
            <h3 className="text-base sm:text-lg font-black text-heading leading-snug font-serif uppercase tracking-tight group-hover:text-secondary transition duration-200">
              Handpicked Potatoes: The Secret to Crispy Wafers
            </h3>
            <p className="text-xs text-muted leading-relaxed font-semibold">
              Every batch starts with carefully handpicked, farm-fresh potatoes chosen for low moisture, ensuring thin slices that fry to a light, golden crunch without excess oil.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 space-y-4 hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-lime-50 text-[#65a30d] border border-lime-100 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-[#65a30d] uppercase tracking-wider">Craftsmanship</span>
            <h3 className="text-base sm:text-lg font-black text-heading leading-snug font-serif uppercase tracking-tight group-hover:text-[#65a30d] transition duration-200">
              Small-Batch Frying: The Secret to Crispy Freshness
            </h3>
            <p className="text-xs text-muted leading-relaxed font-semibold">
              Discover how frying in small, temperature-controlled batches prevents oil degradation, delivering a lighter crunch with less oil retention.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Bottom Infinite ticker */}
      <BottomInfiniteTicker />

    </div>
  );
}
