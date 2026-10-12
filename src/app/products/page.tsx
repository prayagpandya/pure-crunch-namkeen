"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES, Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query params
  const urlCategory = searchParams.get("category") || "All";
  const urlSearch = searchParams.get("search") || "";

  // Dynamic MongoDB state with static fallbacks
  const [allProducts, setAllProducts] = useState<Product[]>(PRODUCTS);
  const [allCategories, setAllCategories] = useState<string[]>(CATEGORIES);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setAllProducts(data.data);
        }
      })
      .catch(() => {});

    fetch("/api/categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setAllCategories(data.categories.filter((c: string) => c !== "Shop All"));
        }
      })
      .catch(() => {});
  }, []);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchVal, setSearchVal] = useState(urlSearch);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("bestselling");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state whenever the URL changes (e.g. clicking top navbar, footer, or browser back/forward)
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    if (urlSearch) {
      setSearchVal(urlSearch);
    }
  }, [urlSearch]);

  const isAllActive =
    !selectedCategory ||
    selectedCategory.toLowerCase() === "all" ||
    selectedCategory.toLowerCase() === "shop all";

  const isCategoryActive = (cat: string) => {
    if (isAllActive) return false;
    const current = selectedCategory.toLowerCase().trim();
    const target = cat.toLowerCase().trim();
    if (target === current) return true;
    if (
      (target === "farali specials" || target === "farali") &&
      (current === "farali specials" || current === "farali")
    ) {
      return true;
    }
    return false;
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (cat === "All" || cat === "Shop All") {
      current.delete("category");
    } else {
      current.set("category", cat);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/products${query}`, { scroll: false });
  };

  // Available Weights in dataset for filters
  const allWeights = useMemo(() => {
    const weightsSet = new Set<string>();
    allProducts.forEach((p) => {
      weightsSet.add(p.weight);
    });
    return Array.from(weightsSet);
  }, [allProducts]);

  // Filter products based on state variables
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Category Filter (Case-insensitive matching)
    if (!isAllActive) {
      const current = selectedCategory.toLowerCase().trim();
      if (current === "farali specials" || current === "farali") {
        result = result.filter((p) => p.isFarali);
      } else {
        result = result.filter(
          (p) => p.category.toLowerCase().trim() === current
        );
      }
    }

    // 2. Search Filter
    if (searchVal.trim()) {
      const query = searchVal.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.subcategory.toLowerCase().includes(query) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(query))
      );
    }

    // 3. Price Filter
    if (minPrice) {
      result = result.filter((p) => p.mrp >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.mrp <= parseFloat(maxPrice));
    }

    // 4. Weight Filter
    if (selectedWeights.length > 0) {
      result = result.filter((p) => selectedWeights.includes(p.weight));
    }

    // 5. Sorting
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.mrp - b.mrp);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.mrp - a.mrp);
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "title-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "title-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // Bestselling (Popular first)
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return result;
  }, [allProducts, isAllActive, selectedCategory, searchVal, minPrice, maxPrice, selectedWeights, sortOption]);

  const handleWeightToggle = (weight: string) => {
    setSelectedWeights((prev) =>
      prev.includes(weight) ? prev.filter((w) => w !== weight) : [...prev, weight]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSearchVal("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedWeights([]);
    router.push("/products", { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="mb-10 text-center sm:text-left space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest border border-primary/20">
          ✨ 100% Pure Groundnut Oil
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-heading font-serif uppercase tracking-tight">
          {isAllActive ? "All Snacks" : selectedCategory}
        </h1>
        <p className="text-xs sm:text-sm text-muted font-semibold">
          Showing <span className="text-heading font-black">{filteredProducts.length}</span> premium snacks • Zero palm oil • Mineral rock salt (Sindhalu)
        </p>
      </div>

      {/* Main Grid: Left Filters sidebar, Right Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-gray-150 sticky top-28 shadow-xs">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-heading flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>Filters</span>
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-[10px] font-black uppercase tracking-wider text-primary hover:text-primary-hover transition cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Category checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-heading">Categories</h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleCategoryChange("All")}
                className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isAllActive
                    ? "bg-primary/10 text-primary font-black"
                    : "text-body hover:bg-warm-bg"
                }`}
              >
                All Snacks
              </button>
              {allCategories.filter(c => c !== "Shop All").map((cat) => {
                const active = isCategoryActive(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      active
                        ? "bg-primary/10 text-primary font-black"
                        : "text-body hover:bg-warm-bg"
                    }`}
                  >
                    {cat === "Farali Specials" ? "🌱 " + cat : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search filter bar */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase text-heading">Search Items</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-primary focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Price Range inputs */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase text-heading">Price Range (₹)</h4>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-center font-semibold focus:outline-none focus:border-primary focus:bg-white transition"
              />
              <span className="text-gray-300 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-center font-semibold focus:outline-none focus:border-primary focus:bg-white transition"
              />
            </div>
          </div>

          {/* Weights Filter */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase text-heading">Pack Weight</h4>
            <div className="flex flex-wrap gap-2">
              {allWeights.map((weight) => {
                const isSelected = selectedWeights.includes(weight);
                return (
                  <button
                    key={weight}
                    onClick={() => handleWeightToggle(weight)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-slate-50 border border-gray-200 text-body hover:bg-warm-bg"
                    }`}
                  >
                    {weight}
                  </button>
                );
              })}
            </div>
          </div>

        </aside>

        {/* Right Products Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Actions: Mobile filter button, Search Bar, Sort Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-150 flex flex-wrap items-center justify-between gap-4">
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 border border-gray-200 text-heading text-xs font-bold rounded-lg flex items-center gap-1.5 active:scale-95 transition hover:bg-slate-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>Filters</span>
            </button>

            {/* Total items label */}
            <div className="text-xs font-semibold text-body max-sm:hidden">
              Found <span className="font-extrabold text-heading">{filteredProducts.length}</span> snacks
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-between">
              <span className="text-xs font-bold text-muted flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort by:</span>
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-heading focus:outline-none focus:border-primary focus:bg-white cursor-pointer"
              >
                <option value="bestselling">Featured / Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="title-asc">Alphabetical: A-Z</option>
                <option value="title-desc">Alphabetical: Z-A</option>
              </select>
            </div>

          </div>

          {/* Product grid list */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-150 rounded-2xl py-24 text-center px-4 space-y-4">
              <div className="text-muted text-4xl">🔍</div>
              <h3 className="text-xl font-bold text-heading font-serif">No snacks found</h3>
              <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto">
                We couldn&apos;t find any snacks matching your filter selections. Try clearing filters or revising search inputs!
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider rounded-full shadow-xs active:scale-95 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filter slide-in drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[120] lg:hidden animate-fade-in">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-80 max-w-[85vw] bg-white flex flex-col justify-between shadow-2xl animate-slide-in-left p-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-heading flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-heading transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable filters body */}
              <div className="flex-grow overflow-y-auto space-y-6 pr-2">
                
                {/* Search */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-heading">Search Items</h4>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-primary"
                    />
                    <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-heading">Categories</h4>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        handleCategoryChange("All");
                        setIsMobileFilterOpen(false);
                      }}
                      className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        isAllActive
                          ? "bg-primary/10 text-primary font-black"
                          : "text-body hover:bg-warm-bg"
                      }`}
                    >
                      All Snacks
                    </button>
                    {allCategories.filter(c => c !== "Shop All").map((cat) => {
                      const active = isCategoryActive(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            handleCategoryChange(cat);
                            setIsMobileFilterOpen(false);
                          }}
                          className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                            active
                              ? "bg-primary/10 text-primary font-black"
                              : "text-body hover:bg-warm-bg"
                          }`}
                        >
                          {cat === "Farali Specials" ? "🌱 " + cat : cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price range */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-heading">Price Range (₹)</h4>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-center font-semibold"
                    />
                    <span className="text-gray-300 text-xs">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-center font-semibold"
                    />
                  </div>
                </div>

                {/* Weights */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-heading">Pack Weight</h4>
                  <div className="flex flex-wrap gap-2">
                    {allWeights.map((weight) => {
                      const isSelected = selectedWeights.includes(weight);
                      return (
                        <button
                          key={weight}
                          onClick={() => handleWeightToggle(weight)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-slate-50 border border-gray-200 text-body hover:bg-warm-bg"
                          }`}
                        >
                          {weight}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Bottom Apply Actions */}
              <div className="pt-4 border-t border-gray-150 flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="w-1/2 py-2.5 text-xs font-black uppercase tracking-wider text-heading bg-warm-bg rounded-full active:scale-95 transition cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-primary hover:bg-primary-hover rounded-full active:scale-95 transition cursor-pointer"
                >
                  Apply
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto sm:mx-0"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto sm:mx-0"></div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
