"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Lock, 
  Package, 
  Tags, 
  Plus, 
  Trash2, 
  LogOut, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Search, 
  Star, 
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  ShoppingBag,
  Images,
  X,
  Pencil,
  Upload,
  UploadCloud,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Product } from "@/data/products";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const EXISTING_IMAGE_PRESETS = [
  { name: "Plain Salty Wafers", url: "/products/plain-salty.jpg" },
  { name: "Plain Masala Wafers", url: "/products/plain-masala.jpg" },
  { name: "Salty Line Wafers", url: "/products/salty-line.jpg" },
  { name: "Masala Line Wafers", url: "/products/masala-line.jpg" },
  { name: "Mari Banana Wafers", url: "/products/mari-banana.jpg" },
  { name: "Farali Chevdo", url: "/products/farali-chevdo.jpg" },
  { name: "Healthy Wheels", url: "/products/healthy-wheels.jpg" },
  { name: "Masala Wheels", url: "/products/masala-wheels.jpg" },
  { name: "Methi Khakhra", url: "/products/methi-khakhra.jpg" },
  { name: "Masala Khakhra", url: "/products/masala-khakhra.jpg" },
  { name: "Jeera Khakhra", url: "/products/jeera-khakhra.jpg" },
  { name: "Kothmir Khakhra", url: "/products/kothmir-khakhra.jpg" },
  { name: "Farali Khakhra", url: "/products/farali-khakhra.jpg" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "hero">("products");

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Product Form Modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productSuccess, setProductSuccess] = useState("");
  const [productError, setProductError] = useState("");

  // New Product Form Data
  const [newProduct, setNewProduct] = useState({
    name: "",
    id: "",
    category: "Wafers",
    subcategory: "Potato Wafers",
    mrp: 70,
    weight: "125 g",
    image: "/products/plain-salty.jpg",
    images: ["/products/plain-salty.jpg"] as string[],
    ingredients: "Potato, Pure Groundnut Oil, Rock Salt (Sindhalu)",
    description: "",
    features: "100% Pure Groundnut Oil, Rock Salt (Sindhalu), Small Batch Frying",
    funFact: "",
    isFarali: false,
    energy: "540 kcal",
    protein: "6.5 g",
    carbohydrates: "52 g",
    fat: "34 g",
    sodium: "580 mg",
  });
  const [imageInputUrl, setImageInputUrl] = useState("");

  // Edit Product Modal state
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editProductSubmitting, setEditProductSubmitting] = useState(false);
  const [editProductSuccess, setEditProductSuccess] = useState("");
  const [editProductError, setEditProductError] = useState("");
  const [editingProduct, setEditingProduct] = useState({
    id: "",
    name: "",
    category: "Wafers",
    subcategory: "Potato Wafers",
    mrp: 70,
    weight: "125 g",
    image: "/products/plain-salty.jpg",
    images: ["/products/plain-salty.jpg"] as string[],
    ingredients: "Potato, Pure Groundnut Oil, Rock Salt (Sindhalu)",
    description: "",
    features: "100% Pure Groundnut Oil, Rock Salt (Sindhalu)",
    funFact: "",
    isFarali: false,
    energy: "540 kcal",
    protein: "6.5 g",
    carbohydrates: "52 g",
    fat: "34 g",
    sodium: "580 mg",
  });
  const [editImageInputUrl, setEditImageInputUrl] = useState("");

  // Device File Upload States for Add Product
  const [addUploading, setAddUploading] = useState(false);
  const [addUploadError, setAddUploadError] = useState("");
  const [addDragActive, setAddDragActive] = useState(false);

  // Device File Upload States for Edit Product
  const [editUploading, setEditUploading] = useState(false);
  const [editUploadError, setEditUploadError] = useState("");
  const [editDragActive, setEditDragActive] = useState(false);

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [categorySuccess, setCategorySuccess] = useState("");

  // Hero Section Form State
  interface HeroSlideData {
    id: number;
    imageSrc: string;
    title: string;
    subtitle: string;
    buttonText: string;
    link: string;
  }
  const [heroSlides, setHeroSlides] = useState<HeroSlideData[]>([]);
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState("");
  const [heroError, setHeroError] = useState("");
  const [heroUploadingIndex, setHeroUploadingIndex] = useState<number | null>(null);
  const [heroUploadError, setHeroUploadError] = useState("");

  // New Slide Form State (empty by default)
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [newHeroSlide, setNewHeroSlide] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    link: "",
    imageSrc: "",
  });
  const [newSlideUploading, setNewSlideUploading] = useState(false);
  const [newSlideUploadError, setNewSlideUploadError] = useState("");
  const [newSlideSaving, setNewSlideSaving] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Prevent scrollbar on admin authentication screen
  useEffect(() => {
    if (!isAuthenticated) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchAllData();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const [prodRes, catRes, heroRes] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
        fetch("/api/admin/hero", { cache: "no-store" }),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const heroData = await heroRes.json();

      if (prodData.success) setProducts(prodData.products || []);
      if (catData.success) setCategories((catData.categories || []).filter((c: string) => c !== "Shop All"));
      if (heroData.success && Array.isArray(heroData.slides)) setHeroSlides(heroData.slides);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setPassword("");
        fetchAllData();
      } else {
        setLoginError(data.error || "Invalid admin password");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  // Add Product handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.images.length === 0 && !newProduct.image) {
      setProductError("Please upload or add at least 1 photo for this product.");
      return;
    }

    setProductSubmitting(true);
    setProductError("");
    setProductSuccess("");

    try {
      const payload = {
        name: newProduct.name,
        id: newProduct.id,
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        mrp: Number(newProduct.mrp),
        weight: newProduct.weight,
        image: newProduct.images[0] || newProduct.image,
        images: newProduct.images,
        ingredients: newProduct.ingredients,
        description: newProduct.description,
        features: newProduct.features,
        funFact: newProduct.funFact,
        isFarali: newProduct.isFarali,
        nutritionInfo: {
          energy: newProduct.energy,
          protein: newProduct.protein,
          carbohydrates: newProduct.carbohydrates,
          fat: newProduct.fat,
          sodium: newProduct.sodium,
        },
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setProductSuccess(`Product "${newProduct.name}" added successfully to MongoDB!`);
        fetchAllData();
        setTimeout(() => {
          setIsAddProductOpen(false);
          setProductSuccess("");
          setNewProduct({
            name: "",
            id: "",
            category: categories[0] || "Wafers",
            subcategory: "Potato Wafers",
            mrp: 70,
            weight: "125 g",
            image: "/products/plain-salty.jpg",
            images: ["/products/plain-salty.jpg"],
            ingredients: "Potato, Pure Groundnut Oil, Rock Salt (Sindhalu)",
            description: "",
            features: "100% Pure Groundnut Oil, Rock Salt (Sindhalu)",
            funFact: "",
            isFarali: false,
            energy: "540 kcal",
            protein: "6.5 g",
            carbohydrates: "52 g",
            fat: "34 g",
            sodium: "580 mg",
          });
          setImageInputUrl("");
        }, 1200);
      } else {
        setProductError(data.error || "Failed to create product");
      }
    } catch {
      setProductError("Failed to save product due to a network error.");
    } finally {
      setProductSubmitting(false);
    }
  };

  // Image list management helpers for multiple product photos
  const handleAddImageUrl = (urlToAdd?: string) => {
    const targetUrl = (urlToAdd !== undefined ? urlToAdd : imageInputUrl).trim();
    if (!targetUrl) return;

    if (newProduct.images.includes(targetUrl)) {
      setImageInputUrl("");
      return;
    }

    const updatedImages = [...newProduct.images, targetUrl];
    setNewProduct({
      ...newProduct,
      images: updatedImages,
      image: updatedImages[0] || targetUrl,
    });
    setImageInputUrl("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = newProduct.images.filter((_, idx) => idx !== indexToRemove);
    setNewProduct({
      ...newProduct,
      images: updatedImages,
      image: updatedImages[0] || "",
    });
  };

  const handleSetMainImage = (indexToMakeMain: number) => {
    if (indexToMakeMain === 0 || indexToMakeMain >= newProduct.images.length) return;
    const selected = newProduct.images[indexToMakeMain];
    const remaining = newProduct.images.filter((_, idx) => idx !== indexToMakeMain);
    const updatedImages = [selected, ...remaining];
    setNewProduct({
      ...newProduct,
      images: updatedImages,
      image: selected,
    });
  };

  // Device File Upload Handler (supports multiple photos from admin's device)
  const handleDeviceUpload = async (
    files: FileList | File[],
    target: "new" | "edit"
  ) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(
      (f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(f.name)
    );

    if (imageFiles.length === 0) {
      const msg = "Please select valid image files (JPG, PNG, WebP, GIF, etc.)";
      if (target === "new") setAddUploadError(msg);
      else setEditUploadError(msg);
      return;
    }

    if (target === "new") {
      setAddUploading(true);
      setAddUploadError("");
    } else {
      setEditUploading(true);
      setEditUploadError("");
    }

    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.urls) && data.urls.length > 0) {
        if (target === "new") {
          // If default placeholder was present and product isn't plain salty wafers, replace it
          const currentList = newProduct.images.filter(
            (img) => img !== "/products/plain-salty.jpg" || newProduct.name.toLowerCase().includes("plain salty")
          );
          const combined = [...currentList, ...data.urls.filter((u: string) => !currentList.includes(u))];
          setNewProduct((prev) => ({
            ...prev,
            images: combined,
            image: combined[0] || data.urls[0],
          }));
        } else {
          const currentList = [...editingProduct.images];
          const combined = [...currentList, ...data.urls.filter((u: string) => !currentList.includes(u))];
          setEditingProduct((prev) => ({
            ...prev,
            images: combined,
            image: combined[0] || data.urls[0],
          }));
        }
      } else {
        const err = data.error || "Failed to upload images from device";
        if (target === "new") setAddUploadError(err);
        else setEditUploadError(err);
      }
    } catch (caughtError) {
      console.error("Device upload exception:", caughtError);
      const networkMsg = "Network error during image upload. Please try again.";
      if (target === "new") setAddUploadError(networkMsg);
      else setEditUploadError(networkMsg);
    } finally {
      if (target === "new") setAddUploading(false);
      else setEditUploading(false);
    }
  };

  // Edit Product Open & Population Handler
  const handleOpenEditProduct = (prod: Product) => {
    setEditProductError("");
    setEditProductSuccess("");
    setEditUploadError("");
    const imagesList = (prod.images && prod.images.length > 0)
      ? [...prod.images]
      : [prod.image || "/products/plain-salty.jpg"];

    setEditingProduct({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      subcategory: prod.subcategory || prod.category,
      mrp: prod.mrp,
      weight: prod.weight || "125 g",
      image: prod.image || imagesList[0],
      images: imagesList,
      ingredients: Array.isArray(prod.ingredients) ? prod.ingredients.join(", ") : (prod.ingredients || ""),
      description: prod.description || "",
      features: Array.isArray(prod.features) ? prod.features.join(", ") : (prod.features || ""),
      funFact: prod.funFact || "",
      isFarali: Boolean(prod.isFarali),
      energy: prod.nutritionInfo?.energy || "540 kcal",
      protein: prod.nutritionInfo?.protein || "6.5 g",
      carbohydrates: prod.nutritionInfo?.carbohydrates || "52 g",
      fat: prod.nutritionInfo?.fat || "34 g",
      sodium: prod.nutritionInfo?.sodium || "580 mg",
    });
    setEditImageInputUrl("");
    setIsEditProductOpen(true);
    setIsAddProductOpen(false);
  };

  const handleEditAddImageUrl = (urlToAdd?: string) => {
    const targetUrl = (urlToAdd !== undefined ? urlToAdd : editImageInputUrl).trim();
    if (!targetUrl) return;

    if (editingProduct.images.includes(targetUrl)) {
      setEditImageInputUrl("");
      return;
    }

    const updatedImages = [...editingProduct.images, targetUrl];
    setEditingProduct({
      ...editingProduct,
      images: updatedImages,
      image: updatedImages[0] || targetUrl,
    });
    setEditImageInputUrl("");
  };

  const handleEditRemoveImage = (indexToRemove: number) => {
    const updatedImages = editingProduct.images.filter((_, idx) => idx !== indexToRemove);
    setEditingProduct({
      ...editingProduct,
      images: updatedImages,
      image: updatedImages[0] || "",
    });
  };

  const handleEditSetMainImage = (indexToMakeMain: number) => {
    if (indexToMakeMain === 0 || indexToMakeMain >= editingProduct.images.length) return;
    const selected = editingProduct.images[indexToMakeMain];
    const remaining = editingProduct.images.filter((_, idx) => idx !== indexToMakeMain);
    const updatedImages = [selected, ...remaining];
    setEditingProduct({
      ...editingProduct,
      images: updatedImages,
      image: selected,
    });
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name.trim()) {
      setEditProductError("Product name is required");
      return;
    }
    if (editingProduct.images.length === 0 && !editingProduct.image) {
      setEditProductError("Please add at least 1 photo for this product.");
      return;
    }

    setEditProductSubmitting(true);
    setEditProductError("");
    setEditProductSuccess("");

    try {
      const payload = {
        id: editingProduct.id,
        name: editingProduct.name.trim(),
        category: editingProduct.category,
        subcategory: editingProduct.subcategory.trim() || editingProduct.category,
        mrp: Number(editingProduct.mrp),
        weight: editingProduct.weight.trim(),
        image: editingProduct.images[0] || editingProduct.image,
        images: editingProduct.images,
        ingredients: editingProduct.ingredients,
        description: editingProduct.description.trim(),
        features: editingProduct.features,
        funFact: editingProduct.funFact.trim(),
        isFarali: editingProduct.isFarali,
        nutritionInfo: {
          energy: editingProduct.energy,
          protein: editingProduct.protein,
          carbohydrates: editingProduct.carbohydrates,
          fat: editingProduct.fat,
          sodium: editingProduct.sodium,
        },
      };

      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setEditProductSuccess(`Product "${editingProduct.name}" updated successfully!`);
        fetchAllData();
        setTimeout(() => {
          setIsEditProductOpen(false);
          setEditProductSuccess("");
        }, 1200);
      } else {
        setEditProductError(data.error || "Failed to update product");
      }
    } catch {
      setEditProductError("Failed to update product due to a network error.");
    } finally {
      setEditProductSubmitting(false);
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" (${id}) from MongoDB?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch {
      alert("Error deleting product");
    }
  };

  // Add Category handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCategorySubmitting(true);
    setCategoryError("");
    setCategorySuccess("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((data.categories || []).filter((c: string) => c !== "Shop All"));
        setCategorySuccess(`Category "${newCategoryName.trim()}" added!`);
        setNewCategoryName("");
        setTimeout(() => setCategorySuccess(""), 3000);
      } else {
        setCategoryError(data.error || "Failed to add category");
      }
    } catch {
      setCategoryError("Error adding category");
    } finally {
      setCategorySubmitting(false);
    }
  };

  // Delete Category handler
  const handleDeleteCategory = async (catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?name=${encodeURIComponent(catName)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCategories((data.categories || []).filter((c: string) => c !== "Shop All"));
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch {
      alert("Error deleting category");
    }
  };

  // -------------------------------------------------------------
  // HERO SLIDE HANDLERS
  // -------------------------------------------------------------
  const handleHeroSlideChange = (index: number, field: keyof HeroSlideData, value: string | number) => {
    setHeroSlides((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleHeroDeviceUpload = async (index: number, file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setHeroUploadError(`Image "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max supported size is 10MB.`);
      return;
    }
    setHeroUploadError("");
    setHeroUploadingIndex(index);

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const uploadedUrl = data.url || (Array.isArray(data.urls) && data.urls.length > 0 ? data.urls[0] : null);
      if (data.success && uploadedUrl) {
        setHeroSlides((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], imageSrc: uploadedUrl };
          return updated;
        });
      } else {
        setHeroUploadError(data.error || "Failed to upload banner image.");
      }
    } catch {
      setHeroUploadError("Upload failed due to network error.");
    } finally {
      setHeroUploadingIndex(null);
    }
  };

  const handleNewSlideDeviceUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setNewSlideUploadError(`Image "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max supported size is 10MB.`);
      return;
    }
    setNewSlideUploadError("");
    setNewSlideUploading(true);

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const uploadedUrl = data.url || (Array.isArray(data.urls) && data.urls.length > 0 ? data.urls[0] : null);
      if (data.success && uploadedUrl) {
        setNewHeroSlide((prev) => ({
          ...prev,
          imageSrc: uploadedUrl,
        }));
      } else {
        setNewSlideUploadError(data.error || "Failed to upload banner image.");
      }
    } catch {
      setNewSlideUploadError("Upload failed due to network error.");
    } finally {
      setNewSlideUploading(false);
    }
  };

  const handleSaveNewHeroSlide = async () => {
    if (!newHeroSlide.imageSrc.trim()) {
      setNewSlideUploadError("Please upload a banner image before saving this slide.");
      return;
    }
    const nextId = heroSlides.length > 0 ? Math.max(...heroSlides.map((s) => s.id || 0)) + 1 : 1;
    const slideToAdd: HeroSlideData = {
      id: nextId,
      imageSrc: newHeroSlide.imageSrc.trim(),
      title: newHeroSlide.title.trim() || "Pure Crunch Healthy Namkeen",
      subtitle: newHeroSlide.subtitle.trim(),
      buttonText: newHeroSlide.buttonText.trim() || "Shop Now",
      link: newHeroSlide.link.trim() || "/products",
    };

    const updatedSlides = [...heroSlides, slideToAdd];

    setNewSlideSaving(true);
    setNewSlideUploadError("");

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: updatedSlides }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.slides) {
          setHeroSlides(data.slides);
        } else {
          setHeroSlides(updatedSlides);
        }
        setIsAddSlideOpen(false);
        setNewHeroSlide({
          title: "",
          subtitle: "",
          buttonText: "",
          link: "",
          imageSrc: "",
        });
        setHeroSuccess("New hero banner slide saved directly to database successfully!");
        setTimeout(() => setHeroSuccess(""), 4000);
      } else {
        setNewSlideUploadError(data.error || "Failed to save slide to database.");
      }
    } catch {
      setNewSlideUploadError("Network error while saving slide to database.");
    } finally {
      setNewSlideSaving(false);
    }
  };

  const handleRemoveHeroSlide = async (index: number) => {
    if (heroSlides.length <= 1) {
      alert("At least one hero banner slide is required.");
      return;
    }
    if (!confirm("Are you sure you want to remove this banner slide?")) return;
    const updated = heroSlides.filter((_, i) => i !== index);
    setHeroSlides(updated);

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setHeroSuccess("Banner slide removed and saved to database.");
        if (data.slides) setHeroSlides(data.slides);
        setTimeout(() => setHeroSuccess(""), 3000);
      }
    } catch (e) {
      console.error("Failed to delete slide from database:", e);
    }
  };

  const handleMoveHeroSlide = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroSlides.length) return;

    setHeroSlides((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleSaveHeroSlides = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (heroSlides.length === 0) {
      setHeroError("Please include at least one hero slide.");
      return;
    }

    setHeroSubmitting(true);
    setHeroError("");
    setHeroSuccess("");

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: heroSlides }),
      });

      const data = await res.json();
      if (data.success) {
        setHeroSuccess("Hero section banner slides updated successfully!");
        if (data.slides) setHeroSlides(data.slides);
        setTimeout(() => setHeroSuccess(""), 4000);
      } else {
        setHeroError(data.error || "Failed to update hero slides.");
      }
    } catch {
      setHeroError("Network error while saving hero slides.");
    } finally {
      setHeroSubmitting(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading indicator on initial check
  if (isAuthenticated === null) {
    return (
      <div className="flex-1 h-[calc(100dvh-105px)] md:h-[calc(100dvh-121px)] max-h-[calc(100dvh-105px)] md:max-h-[calc(100dvh-121px)] flex items-center justify-center bg-warm-bg/50 overflow-hidden">
        <div className="flex items-center gap-3 text-heading font-black">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGIN SCREEN (CENTERED WITH NAVBAR & NO SCROLLBAR)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="flex-1 h-[calc(100dvh-105px)] md:h-[calc(100dvh-121px)] max-h-[calc(100dvh-105px)] md:max-h-[calc(100dvh-121px)] flex items-center justify-center bg-warm-bg/50 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-md w-full bg-white p-7 sm:p-9 rounded-3xl shadow-xl border border-primary/10 space-y-6">
          
          <div className="text-center space-y-2.5">
            <div className="flex justify-center mb-1">
              <div className="relative w-40 h-14">
                <Image
                  src="/images/main_logo.webp"
                  alt="Pure Crunch Logo"
                  fill
                  sizes="160px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </div>
            
            <p className="text-xs text-muted font-semibold leading-relaxed">
              Enter your secure administrator password to manage Pure Crunch products and categories.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter administrator password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-heading cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <Link 
                href="/" 
                className="text-xs font-bold text-primary hover:text-primary-hover transition"
              >
                ← Return to Public Website
              </Link>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Top Navbar */}
      <header className="bg-charcoal text-white border-b-4 border-primary sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-secondary text-xs font-black uppercase tracking-wider border border-secondary/30">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center gap-1.5"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Metric Badges Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-muted mb-1">Total Products</div>
              <div className="text-3xl font-black text-heading font-serif">{products.length}</div>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-muted mb-1">Active Categories</div>
              <div className="text-3xl font-black text-heading font-serif">{categories.length}</div>
            </div>
            <div className="p-3 bg-secondary/15 text-yellow-600 rounded-xl">
              <Tags className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-muted mb-1">Hero Banners</div>
              <div className="text-3xl font-black text-heading font-serif">{heroSlides.length}</div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Images className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "products"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-heading hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "categories"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-heading hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Tags className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("hero")}
              className={`px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "hero"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-heading hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Images className="w-4 h-4" />
              <span>Hero Banners ({heroSlides.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchAllData}
              disabled={loadingData}
              className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-heading transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? "animate-spin text-primary" : ""}`} />
            </button>

            {activeTab === "products" && (
              <button
                onClick={() => setIsAddProductOpen(!isAddProductOpen)}
                className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider rounded-full shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddProductOpen ? "Close Product Form" : "Add New Product"}</span>
              </button>
            )}

            {activeTab === "hero" && (
              <button
                type="button"
                onClick={() => handleSaveHeroSlides()}
                disabled={heroSubmitting}
                className="px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                {heroSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Banners</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PRODUCTS TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "products" && (
          <div className="space-y-6">
            
            {/* ADD PRODUCT FORM (COLLAPSIBLE CARD) */}
            {isAddProductOpen && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-primary/20 shadow-xl space-y-6 animate-zoom-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-heading font-serif uppercase tracking-tight">
                      Add New Product to Pure Crunch
                    </h3>
                    <p className="text-xs text-muted font-semibold mt-0.5">
                      This product will be saved directly into MongoDB and immediately become visible to shoppers.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsAddProductOpen(false)}
                    className="p-2 text-gray-400 hover:text-heading cursor-pointer text-xs font-bold"
                  >
                    Cancel ✕
                  </button>
                </div>

                {productSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>{productSuccess}</span>
                  </div>
                )}

                {productError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{productError}</span>
                  </div>
                )}

                <form onSubmit={handleAddProduct} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* Product Name */}
                    <div>
                      <label className="block text-xs font-bold text-heading mb-1 uppercase">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pudina Masala Wafers"
                        value={newProduct.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          const autoSlug = val.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                          setNewProduct({ ...newProduct, name: val, id: autoSlug });
                        }}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                      />
                    </div>

                    {/* URL Slug ID */}
                    <div>
                      <label className="block text-xs font-bold text-heading mb-1 uppercase">
                        Product ID / Slug *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. pudina-masala-wafers"
                        value={newProduct.id}
                        onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50 font-mono"
                      />
                    </div>

                    {/* Category Select */}
                    <div>
                      <label className="block text-xs font-bold text-heading mb-1 uppercase">
                        Category *
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                      >
                        {categories.filter(c => c !== "Shop All").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-xs font-bold text-heading mb-1 uppercase">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Potato Wafers, Banana Wafers..."
                        value={newProduct.subcategory}
                        onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                      />
                    </div>

                    {/* MRP Price */}
                    <div>
                      <label className="block text-xs font-bold text-heading mb-1 uppercase">
                        MRP Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="1"
                        required
                        placeholder="70"
                        value={newProduct.mrp}
                        onChange={(e) => setNewProduct({ ...newProduct, mrp: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-xs font-bold text-heading mb-1 uppercase">
                        Pack Weight *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                      />
                    </div>

                  </div>

                  {/* Multi-Photo Gallery Manager */}
                  <div className="space-y-3.5 border border-primary/20 p-4 sm:p-5 rounded-2xl bg-warm-bg/25">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <label className="block text-xs font-bold text-heading uppercase flex items-center gap-1.5">
                          <Images className="w-4 h-4 text-primary" />
                          <span>Product Photos Gallery *</span>
                          <span className="text-[11px] font-semibold text-primary">
                            ({newProduct.images.length} {newProduct.images.length === 1 ? "photo" : "photos"} added)
                          </span>
                        </label>
                        <p className="text-[11px] text-muted font-medium mt-0.5">
                          Add multiple photos of the product. The <strong>★ Main</strong> photo will be shown on product cards, cart, and the primary detail view.
                        </p>
                      </div>
                    </div>

                    {/* Device Upload Drag & Drop Area */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setAddDragActive(true);
                      }}
                      onDragLeave={() => setAddDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setAddDragActive(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          handleDeviceUpload(e.dataTransfer.files, "new");
                        }
                      }}
                      className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition flex flex-col items-center justify-center gap-2 ${
                        addDragActive
                          ? "border-primary bg-primary/10 scale-[1.01]"
                          : "border-primary/40 bg-white hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      <input
                        type="file"
                        id="new-product-file-upload"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleDeviceUpload(e.target.files, "new");
                            e.target.value = "";
                          }
                        }}
                        className="hidden"
                        disabled={addUploading}
                      />

                      {addUploading ? (
                        <div className="flex flex-col items-center gap-2 py-3">
                          <RefreshCw className="w-7 h-7 text-primary animate-spin" />
                          <span className="text-xs font-bold text-heading">Uploading photos from your device...</span>
                          <span className="text-[10px] text-muted font-medium">Please wait a moment</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <div>
                              <label
                                htmlFor="new-product-file-upload"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs cursor-pointer transition active:scale-95"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Photos from Device</span>
                              </label>
                            </div>
                            <p className="text-[11px] text-heading font-semibold pt-1">
                              or drag and drop multiple images here
                            </p>
                            <p className="text-[10px] text-muted">
                              Supports JPG, PNG, WEBP, GIF (Upload multiple images, up to 10MB each)
                            </p>
                          </div>
                        </>
                      )}

                      {addUploadError && (
                        <div className="w-full mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center justify-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{addUploadError}</span>
                        </div>
                      )}
                    </div>

                    {/* Added Photos Thumbnail Grid */}
                    {newProduct.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
                        {newProduct.images.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className={`group relative rounded-xl border bg-white overflow-hidden transition shadow-xs flex flex-col ${
                              idx === 0
                                ? "border-primary ring-2 ring-primary/30"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="relative h-24 w-full bg-slate-50">
                              <Image
                                src={imgUrl}
                                alt={`Product photo ${idx + 1}`}
                                fill
                                unoptimized={imgUrl.startsWith("data:")}
                                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 120px"
                                className="object-contain p-1.5"
                              />
                              {/* Main photo badge */}
                              {idx === 0 ? (
                                <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                                  ★ Main
                                </span>
                              ) : (
                                <span className="absolute top-1.5 left-1.5 bg-heading/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  #{idx + 1}
                                </span>
                              )}

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                title="Remove photo"
                                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 hover:bg-red-500 hover:text-white text-gray-600 flex items-center justify-center shadow-xs transition cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Card Footer / Action */}
                            <div className="p-1.5 bg-white border-t border-gray-100 flex items-center justify-between text-[10px]">
                              {idx === 0 ? (
                                <span className="text-[10px] font-black text-primary px-1">Primary Display</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetMainImage(idx)}
                                  className="w-full text-center text-primary hover:text-primary-dark font-bold py-0.5 hover:bg-primary/5 rounded transition cursor-pointer"
                                >
                                  Set as Main
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-red-300 bg-red-50/50 text-red-600 text-xs font-semibold text-center">
                        No photos added yet. Please add at least 1 image for the product.
                      </div>
                    )}

                    {/* Add Image Input Bar */}
                    <div className="pt-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={imageInputUrl}
                          onChange={(e) => setImageInputUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddImageUrl();
                            }
                          }}
                          placeholder="/images/your_photo.jpeg or https://images.unsplash.com/..."
                          className="flex-grow p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddImageUrl()}
                          disabled={!imageInputUrl.trim()}
                          className="px-4 py-2.5 bg-heading hover:bg-primary text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                          <span>Add Photo</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-muted uppercase">
                        Quick Add from Existing Pure Crunch Photos:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {EXISTING_IMAGE_PRESETS.map((preset) => {
                          const isAlreadyAdded = newProduct.images.includes(preset.url);
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                if (!isAlreadyAdded) {
                                  handleAddImageUrl(preset.url);
                                }
                              }}
                              disabled={isAlreadyAdded}
                              className={`px-2 py-1 rounded-lg border text-[10px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                                isAlreadyAdded
                                  ? "bg-slate-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : "bg-white text-heading border-gray-200 hover:border-primary hover:text-primary"
                              }`}
                            >
                              <span>{preset.name}</span>
                              {isAlreadyAdded && <Check className="w-3 h-3 text-green-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Ingredients & Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-heading mb-1 uppercase">
                        Ingredients (Comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Potato, Pure Groundnut Oil, Rock Salt..."
                        value={newProduct.ingredients}
                        onChange={(e) => setNewProduct({ ...newProduct, ingredients: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-heading mb-1 uppercase">
                        Features / Highlights (Comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="100% Pure Groundnut Oil, Rock Salt (Sindhalu)..."
                        value={newProduct.features}
                        onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Description & Fun Fact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-heading mb-1 uppercase">
                        Product Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Detailed flavor description..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-heading mb-1 uppercase">
                        Ek Fun Fact!
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Interesting fact about this snack recipe..."
                        value={newProduct.funFact}
                        onChange={(e) => setNewProduct({ ...newProduct, funFact: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Toggle: Farali */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newProduct.isFarali}
                        onChange={(e) => setNewProduct({ ...newProduct, isFarali: e.target.checked })}
                        className="w-4 h-4 text-green-600 rounded-sm border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-xs font-bold text-heading">🌱 Farali (Fasting Friendly)</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsAddProductOpen(false)}
                      className="px-5 py-3 rounded-full text-xs font-bold text-heading bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={productSubmitting}
                      className="px-8 py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      {productSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving to MongoDB...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[3px]" />
                          <span>Publish Product</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* Products Search & List */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="Search by snack name, category, or slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 text-xs font-semibold focus:outline-none focus:border-primary bg-slate-50"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <div className="text-xs text-muted font-bold">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </div>

              {/* Table of Products */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-warm-bg/50 border-b border-gray-200 text-heading uppercase font-black text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Weight</th>
                      <th className="py-3.5 px-4">Tags</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition font-semibold">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-warm-bg/40 relative overflow-hidden flex-shrink-0 border border-gray-200">
                            <Image
                              src={prod.image || "/products/plain-salty.jpg"}
                              alt={prod.name}
                              fill
                              unoptimized={Boolean(prod.image?.startsWith("data:"))}
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <div className="font-black text-heading text-sm">{prod.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted font-mono">{prod.id}</span>
                              {prod.images && prod.images.length > 1 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  <Images className="w-2.5 h-2.5" />
                                  <span>{prod.images.length} photos</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-heading text-[11px] font-bold">
                            {prod.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-primary">
                          ₹{prod.mrp.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-body font-medium">
                          {prod.weight}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {prod.isFarali && (
                              <span className="px-2 py-0.5 rounded-sm bg-green-100 text-green-700 text-[10px] font-black uppercase">
                                Farali
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/products/${prod.id}`}
                              target="_blank"
                              className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-slate-100 transition"
                              title="View Product Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-muted hover:text-blue-600 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                              title="Edit Product Details"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 text-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted font-medium">
                          No products found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EDIT PRODUCT MODAL */}
            {isEditProductOpen && (
              <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-zoom-in my-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 sticky top-0 bg-white z-10">
                    <div>
                      <h3 className="text-xl font-black text-heading font-serif uppercase tracking-tight flex items-center gap-2">
                        <Pencil className="w-5 h-5 text-primary" />
                        <span>Edit Product: {editingProduct.name}</span>
                      </h3>
                      <p className="text-xs text-muted font-semibold mt-0.5">
                        Modify product information, pricing, tags, or gallery photos. Updates apply immediately.
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsEditProductOpen(false)}
                      className="p-2 text-gray-400 hover:text-heading cursor-pointer text-sm font-bold rounded-full hover:bg-gray-100 transition"
                      title="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {editProductSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl font-bold flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      <span>{editProductSuccess}</span>
                    </div>
                  )}

                  {editProductError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{editProductError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveEditProduct} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      
                      {/* Product Name */}
                      <div>
                        <label className="block text-xs font-bold text-heading mb-1 uppercase">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Pudina Masala Wafers"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        />
                      </div>

                      {/* Product Slug / ID (Read-only) */}
                      <div>
                        <label className="block text-xs font-bold text-heading mb-1 uppercase">
                          Product Slug / ID
                        </label>
                        <input
                          type="text"
                          disabled
                          value={editingProduct.id}
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold bg-gray-100 text-muted font-mono cursor-not-allowed"
                          title="Product ID cannot be changed"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs font-bold text-heading mb-1 uppercase">
                          Category *
                        </label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        >
                          {categories.filter(c => c !== "Shop All").map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategory */}
                      <div>
                        <label className="block text-xs font-bold text-heading mb-1 uppercase">
                          Subcategory
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Potato Wafers, Banana Wafers..."
                          value={editingProduct.subcategory}
                          onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        />
                      </div>

                      {/* MRP */}
                      <div>
                        <label className="block text-xs font-bold text-heading mb-1 uppercase">
                          MRP Price (₹) *
                        </label>
                        <input
                          type="number"
                          step="1"
                          required
                          value={editingProduct.mrp}
                          onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        />
                      </div>

                      {/* Weight */}
                      <div>
                        <label className="block text-xs font-bold text-heading mb-1 uppercase">
                          Pack Weight *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.weight}
                          onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        />
                      </div>

                    </div>

                    {/* Multi-Photo Gallery Manager */}
                    <div className="space-y-3.5 border border-primary/20 p-4 sm:p-5 rounded-2xl bg-warm-bg/25">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <label className="block text-xs font-bold text-heading uppercase flex items-center gap-1.5">
                            <Images className="w-4 h-4 text-primary" />
                            <span>Product Photos Gallery *</span>
                            <span className="text-[11px] font-semibold text-primary">
                              ({editingProduct.images.length} {editingProduct.images.length === 1 ? "photo" : "photos"} added)
                            </span>
                          </label>
                          <p className="text-[11px] text-muted font-medium mt-0.5">
                            The <strong>★ Main</strong> photo will be displayed on product cards and primary detail view.
                          </p>
                        </div>
                      </div>

                      {/* Device Upload Drag & Drop Area */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setEditDragActive(true);
                        }}
                        onDragLeave={() => setEditDragActive(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setEditDragActive(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleDeviceUpload(e.dataTransfer.files, "edit");
                          }
                        }}
                        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition flex flex-col items-center justify-center gap-2 ${
                          editDragActive
                            ? "border-primary bg-primary/10 scale-[1.01]"
                            : "border-primary/40 bg-white hover:border-primary hover:bg-primary/5"
                        }`}
                      >
                        <input
                          type="file"
                          id="edit-product-file-upload"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleDeviceUpload(e.target.files, "edit");
                              e.target.value = "";
                            }
                          }}
                          className="hidden"
                          disabled={editUploading}
                        />

                        {editUploading ? (
                          <div className="flex flex-col items-center gap-2 py-3">
                            <RefreshCw className="w-7 h-7 text-primary animate-spin" />
                            <span className="text-xs font-bold text-heading">Uploading photos from your device...</span>
                            <span className="text-[10px] text-muted font-medium">Please wait a moment</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <div>
                                <label
                                  htmlFor="edit-product-file-upload"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs cursor-pointer transition active:scale-95"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload Photos from Device</span>
                                </label>
                              </div>
                              <p className="text-[11px] text-heading font-semibold pt-1">
                                or drag and drop multiple images here
                              </p>
                              <p className="text-[10px] text-muted">
                                Supports JPG, PNG, WEBP, GIF (Upload multiple images, up to 10MB each)
                              </p>
                            </div>
                          </>
                        )}

                        {editUploadError && (
                          <div className="w-full mt-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center justify-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{editUploadError}</span>
                          </div>
                        )}
                      </div>

                      {/* Added Photos Thumbnail Grid */}
                      {editingProduct.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
                          {editingProduct.images.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className={`group relative rounded-xl border bg-white overflow-hidden transition shadow-xs flex flex-col ${
                                idx === 0
                                  ? "border-primary ring-2 ring-primary/30"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="relative h-24 w-full bg-slate-50">
                                <Image
                                  src={imgUrl}
                                  alt={`Product photo ${idx + 1}`}
                                  fill
                                  unoptimized={imgUrl.startsWith("data:")}
                                  sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 120px"
                                  className="object-contain p-1.5"
                                />
                                {idx === 0 ? (
                                  <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                                    ★ Main
                                  </span>
                                ) : (
                                  <span className="absolute top-1.5 left-1.5 bg-heading/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    #{idx + 1}
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleEditRemoveImage(idx)}
                                  title="Remove photo"
                                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 hover:bg-red-500 hover:text-white text-gray-600 flex items-center justify-center shadow-xs transition cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="p-1.5 bg-white border-t border-gray-100 flex items-center justify-between text-[10px]">
                                {idx === 0 ? (
                                  <span className="text-[10px] font-black text-primary px-1">Primary Display</span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleEditSetMainImage(idx)}
                                    className="w-full text-center text-primary hover:text-primary-dark font-bold py-0.5 hover:bg-primary/5 rounded transition cursor-pointer"
                                  >
                                    Set as Main
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 border-2 border-dashed border-red-200 rounded-xl bg-red-50/50 text-center text-xs text-red-600 font-bold">
                          ⚠️ No photos added yet. Please pick or enter at least 1 image.
                        </div>
                      )}

                      {/* Add Image Controls */}
                      <div className="space-y-3 pt-2 border-t border-gray-150">
                        <div>
                          <span className="block text-[11px] font-bold uppercase text-muted mb-1.5">
                            Quick Pick from Product Library:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {EXISTING_IMAGE_PRESETS.map((preset) => {
                              const alreadyAdded = editingProduct.images.includes(preset.url);
                              return (
                                <button
                                  key={preset.url}
                                  type="button"
                                  onClick={() => handleEditAddImageUrl(preset.url)}
                                  disabled={alreadyAdded}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                                    alreadyAdded
                                      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50"
                                      : "bg-white text-heading border border-gray-300 hover:border-primary hover:text-primary hover:bg-primary/5 shadow-2xs"
                                  }`}
                                >
                                  <span>{preset.name}</span>
                                  {alreadyAdded && <Check className="w-3 h-3 text-green-600" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <span className="block text-[11px] font-bold uppercase text-muted mb-1.5">
                            Or Add Custom Photo Path / URL:
                          </span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="/images/your_custom_snack.jpeg or https://..."
                              value={editImageInputUrl}
                              onChange={(e) => setEditImageInputUrl(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleEditAddImageUrl();
                                }
                              }}
                              className="flex-grow p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleEditAddImageUrl()}
                              className="px-4 py-2.5 bg-heading hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer flex-shrink-0"
                            >
                              + Add Photo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Nutrition Info */}
                    <div className="border border-gray-200 p-4 sm:p-5 rounded-2xl bg-slate-50 space-y-3">
                      <h4 className="text-xs font-black uppercase text-heading">
                        Nutritional Values (Per 100g)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-muted mb-1 uppercase">Energy</label>
                          <input
                            type="text"
                            value={editingProduct.energy}
                            onChange={(e) => setEditingProduct({ ...editingProduct, energy: e.target.value })}
                            className="w-full p-2 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted mb-1 uppercase">Protein</label>
                          <input
                            type="text"
                            value={editingProduct.protein}
                            onChange={(e) => setEditingProduct({ ...editingProduct, protein: e.target.value })}
                            className="w-full p-2 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted mb-1 uppercase">Carbs</label>
                          <input
                            type="text"
                            value={editingProduct.carbohydrates}
                            onChange={(e) => setEditingProduct({ ...editingProduct, carbohydrates: e.target.value })}
                            className="w-full p-2 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted mb-1 uppercase">Fat</label>
                          <input
                            type="text"
                            value={editingProduct.fat}
                            onChange={(e) => setEditingProduct({ ...editingProduct, fat: e.target.value })}
                            className="w-full p-2 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-muted mb-1 uppercase">Sodium</label>
                          <input
                            type="text"
                            value={editingProduct.sodium}
                            onChange={(e) => setEditingProduct({ ...editingProduct, sodium: e.target.value })}
                            className="w-full p-2 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Ingredients & Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-heading mb-1 uppercase">
                          Ingredients List (Comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="Potato, Pure Groundnut Oil, Rock Salt..."
                          value={editingProduct.ingredients}
                          onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-heading mb-1 uppercase">
                          Features / Highlights (Comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="100% Pure Groundnut Oil, Rock Salt (Sindhalu)..."
                          value={editingProduct.features}
                          onChange={(e) => setEditingProduct({ ...editingProduct, features: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* Description & Fun Fact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-heading mb-1 uppercase">
                          Product Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Detailed flavor description..."
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-heading mb-1 uppercase">
                          Ek Fun Fact!
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Interesting fact about this snack recipe..."
                          value={editingProduct.funFact}
                          onChange={(e) => setEditingProduct({ ...editingProduct, funFact: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* Toggle: Farali */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingProduct.isFarali}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isFarali: e.target.checked })}
                          className="w-4 h-4 text-green-600 rounded-sm border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-xs font-bold text-heading">🌱 Farali (Fasting Friendly)</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsEditProductOpen(false)}
                        className="px-5 py-3 rounded-full text-xs font-bold text-heading bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={editProductSubmitting}
                        className="px-8 py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md transition flex items-center gap-2 cursor-pointer"
                      >
                        {editProductSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Updating in MongoDB...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 stroke-[3px]" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CATEGORIES TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            
            {/* Add Category Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-heading font-serif uppercase tracking-tight">
                Add New Snack Category
              </h3>
              
              {categorySuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{categorySuccess}</span>
                </div>
              )}

              {categoryError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{categoryError}</span>
                </div>
              )}

              <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. Diet Specials, Roasted Bhakri, Sweets..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-grow p-3 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                />
                <button
                  type="submit"
                  disabled={categorySubmitting}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{categorySubmitting ? "Adding..." : "Add Category"}</span>
                </button>
              </form>
            </div>

            {/* Existing Categories List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-heading">
                  Active Categories on Pure Crunch
                </h4>
                <span className="text-xs text-muted font-bold">{categories.filter(c => c !== "Shop All").length} Total</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.filter(c => c !== "Shop All").map((cat) => {
                  const count = products.filter(p => p.category === cat).length;

                  return (
                    <div 
                      key={cat}
                      className="p-4 bg-slate-50 rounded-2xl border border-gray-150 flex items-center justify-between group hover:border-primary/30 transition"
                    >
                      <div className="space-y-0.5">
                        <div className="font-black text-heading text-sm">{cat}</div>
                        <div className="text-[11px] text-muted font-semibold">
                          {count} {count === 1 ? "Product" : "Products"}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/products?category=${encodeURIComponent(cat)}`}
                          target="_blank"
                          className="p-2 text-muted hover:text-primary transition rounded-lg hover:bg-white"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-2 text-muted hover:text-red-600 transition rounded-lg hover:bg-white cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* HERO BANNERS TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            
            {/* Top Info & Action Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl">
                    <Images className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-wider text-heading font-serif">
                    Hero Section Banners & Content
                  </h3>
                </div>
                <p className="text-xs text-muted font-semibold max-w-2xl leading-relaxed">
                  Manage the top rotating hero banners on your homepage. Upload high-res images from your device, choose from snack presets, and customise headlines, taglines, and call-to-action buttons.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddSlideOpen(!isAddSlideOpen);
                    if (!isAddSlideOpen) {
                      setNewHeroSlide({
                        title: "",
                        subtitle: "",
                        buttonText: "",
                        link: "",
                        imageSrc: "",
                      });
                      setNewSlideUploadError("");
                    }
                  }}
                  className={`flex-1 md:flex-initial px-5 py-3 text-xs font-black uppercase tracking-wider rounded-full shadow-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                    isAddSlideOpen
                      ? "bg-primary text-white hover:bg-primary-hover shadow-sm"
                      : "bg-white border border-gray-200 hover:bg-gray-50 text-heading"
                  }`}
                >
                  <Plus className={`w-4 h-4 transition-transform ${isAddSlideOpen ? "rotate-45" : "text-primary"}`} />
                  <span>{isAddSlideOpen ? "Close Slide Form" : "Add Slide"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveHeroSlides()}
                  disabled={heroSubmitting}
                  className="flex-1 md:flex-initial px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {heroSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to MongoDB...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3px]" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* NEW SLIDE FORM (DISPLAYED RIGHT BELOW TOP CARD WITH EMPTY INPUTS & NO IMAGE) */}
            {isAddSlideOpen && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-primary/30 shadow-xl space-y-6 animate-zoom-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                        New Slide
                      </span>
                      <h4 className="text-lg font-black uppercase tracking-wider text-heading font-serif">
                        Add New Hero Banner Slide
                      </h4>
                    </div>
                    <p className="text-xs text-muted font-semibold mt-1">
                      Upload an image from your device and enter the details below. Click &quot;Save Slide&quot; to save directly to the database and publish to the homepage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddSlideOpen(false);
                      setNewHeroSlide({
                        title: "",
                        subtitle: "",
                        buttonText: "",
                        link: "",
                        imageSrc: "",
                      });
                      setNewSlideUploadError("");
                    }}
                    className="p-2 text-gray-400 hover:text-heading cursor-pointer text-xs font-bold"
                  >
                    Cancel ✕
                  </button>
                </div>

                {newSlideUploadError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-bold flex items-center gap-3 animate-fade-in shadow-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{newSlideUploadError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Image Column - Empty Preview Initially */}
                  <div className="lg:col-span-5 space-y-4">
                    <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                      Banner Image *
                    </label>

                    {/* Image Preview - Empty with "No Image Selected" by default */}
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-gray-200 shadow-inner group">
                      {newHeroSlide.imageSrc ? (
                        <Image
                          src={newHeroSlide.imageSrc}
                          alt={newHeroSlide.title || "New slide preview"}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted p-4 text-center">
                          <Images className="w-10 h-10 mb-2 opacity-40 text-gray-400" />
                          <span className="text-xs font-bold text-gray-600">No Image Selected</span>
                          <span className="text-[10px] text-gray-400 mt-1">Upload a banner image from your device below</span>
                        </div>
                      )}

                      {newHeroSlide.imageSrc && (
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                          Live Preview
                        </div>
                      )}
                    </div>

                    {/* Upload from Device */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-dashed border-gray-300 text-center space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        id="new-hero-file-input"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleNewSlideDeviceUpload(file);
                          e.target.value = "";
                        }}
                      />
                      <label
                        htmlFor="new-hero-file-input"
                        className={`w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-heading text-xs font-bold rounded-xl shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer ${
                          newSlideUploading ? "opacity-60 pointer-events-none" : ""
                        }`}
                      >
                        {newSlideUploading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                            <span>Uploading from Device...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4 text-primary" />
                            <span>{newHeroSlide.imageSrc ? "Replace Image from Device" : "Upload Image from Device"}</span>
                          </>
                        )}
                      </label>
                      <p className="text-[10px] text-muted font-medium">
                        Recommended: 1920 × 860 px (Widescreen 16:9). JPG, PNG, WebP under 1MB.
                      </p>
                    </div>
                  </div>

                  {/* Empty Input Fields Column */}
                  <div className="lg:col-span-7 space-y-4">
                    
                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                        Headline / Slide Title
                      </label>
                      <input
                        type="text"
                        value={newHeroSlide.title}
                        onChange={(e) => setNewHeroSlide({ ...newHeroSlide, title: e.target.value })}
                        placeholder="e.g. 100% Pure Groundnut Oil Wafers"
                        className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50 text-heading"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                        Subtitle / Tagline
                      </label>
                      <textarea
                        rows={2}
                        value={newHeroSlide.subtitle}
                        onChange={(e) => setNewHeroSlide({ ...newHeroSlide, subtitle: e.target.value })}
                        placeholder="e.g. Handcrafted fresh in small batches with mineral-rich rock salt and zero palm oil."
                        className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50 text-heading leading-relaxed resize-none"
                      />
                    </div>

                    {/* Button Text & Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={newHeroSlide.buttonText}
                          onChange={(e) => setNewHeroSlide({ ...newHeroSlide, buttonText: e.target.value })}
                          placeholder="e.g. Shop Wafers"
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                          Button Link Destination
                        </label>
                        <input
                          type="text"
                          value={newHeroSlide.link}
                          onChange={(e) => setNewHeroSlide({ ...newHeroSlide, link: e.target.value })}
                          placeholder="e.g. /products?category=Wafers"
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                        />
                      </div>
                    </div>

                    {/* Form Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddSlideOpen(false);
                          setNewHeroSlide({
                            title: "",
                            subtitle: "",
                            buttonText: "",
                            link: "",
                            imageSrc: "",
                          });
                          setNewSlideUploadError("");
                        }}
                        className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-black uppercase text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveNewHeroSlide}
                        disabled={newSlideSaving}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md transition flex items-center gap-2 cursor-pointer"
                      >
                        {newSlideSaving ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Saving Slide...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 stroke-[3px]" />
                            <span>Save Slide</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* Status Feedback Messages */}
            {heroSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-bold flex items-center gap-3 animate-fade-in shadow-xs">
                <Check className="w-4 h-4 flex-shrink-0 text-emerald-600 stroke-[3px]" />
                <span>{heroSuccess}</span>
              </div>
            )}

            {heroError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-bold flex items-center gap-3 animate-fade-in shadow-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{heroError}</span>
              </div>
            )}

            {heroUploadError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-bold flex items-center gap-3 animate-fade-in shadow-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{heroUploadError}</span>
              </div>
            )}

            {/* Slides List */}
            {heroSlides.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Images className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-heading">No Hero Banners Found</h4>
                <p className="text-xs text-muted max-w-md mx-auto">
                  Click the button below to add your first homepage hero banner slide.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddSlideOpen(true)}
                  className="px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md hover:bg-primary-hover transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Slide</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 hover:border-primary/20 transition"
                  >
                    {/* Slide Header Toolbar */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-black uppercase tracking-wider text-heading">
                          Banner Slide #{idx + 1}
                        </span>
                        {idx === 0 && (
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary/20 text-yellow-800 text-[10px] font-black uppercase tracking-wider">
                            First Active Banner
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMoveHeroSlide(idx, "up")}
                          disabled={idx === 0}
                          className="p-2 rounded-xl border border-gray-200 text-heading hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                          title="Move Slide Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveHeroSlide(idx, "down")}
                          disabled={idx === heroSlides.length - 1}
                          className="p-2 rounded-xl border border-gray-200 text-heading hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                          title="Move Slide Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveHeroSlide(idx)}
                          className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer ml-1"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Slide Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Image Management Column (5 cols) */}
                      <div className="lg:col-span-5 space-y-4">
                        <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                          Banner Image
                        </label>

                        {/* Image Preview */}
                        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-gray-200 shadow-inner group">
                          {slide.imageSrc ? (
                            <Image
                              src={slide.imageSrc}
                              alt={slide.title || `Hero banner ${idx + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 400px"
                              className="object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                              <Images className="w-8 h-8 mb-2 opacity-50" />
                              <span className="text-xs font-semibold">No Image Selected</span>
                            </div>
                          )}

                          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                            Live Preview
                          </div>
                        </div>

                        {/* Upload from Device */}
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-dashed border-gray-300 text-center space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            id={`hero-file-input-${idx}`}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleHeroDeviceUpload(idx, file);
                              e.target.value = "";
                            }}
                          />
                          <label
                            htmlFor={`hero-file-input-${idx}`}
                            className={`w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-heading text-xs font-bold rounded-xl shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer ${
                              heroUploadingIndex === idx ? "opacity-60 pointer-events-none" : ""
                            }`}
                          >
                            {heroUploadingIndex === idx ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                                <span>Uploading from Device...</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-4 h-4 text-primary" />
                                <span>Upload Image from Device</span>
                              </>
                            )}
                          </label>
                          <p className="text-[10px] text-muted font-medium">
                            Recommended: 1920 × 860 px (Widescreen 16:9). JPG, PNG, WebP under 1MB.
                          </p>
                        </div>
                      </div>

                      {/* Text & Button Settings Column (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        
                        {/* Title */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                            Headline / Slide Title
                          </label>
                          <input
                            type="text"
                            required
                            value={slide.title}
                            onChange={(e) => handleHeroSlideChange(idx, "title", e.target.value)}
                            placeholder="e.g. 100% Pure Groundnut Oil Wafers"
                            className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50 text-heading"
                          />
                        </div>

                        {/* Subtitle */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                            Tagline / Description
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={slide.subtitle}
                            onChange={(e) => handleHeroSlideChange(idx, "subtitle", e.target.value)}
                            placeholder="e.g. Seasoned with mineral-rich rock salt (Sindhalu) for light, heart-healthy snacking."
                            className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50 leading-relaxed"
                          />
                        </div>

                        {/* Button Configuration */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                          
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                              Button Label
                            </label>
                            <input
                              type="text"
                              value={slide.buttonText}
                              onChange={(e) => handleHeroSlideChange(idx, "buttonText", e.target.value)}
                              placeholder="e.g. Shop Wafers"
                              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                              Button Link Destination
                            </label>
                            <input
                              type="text"
                              value={slide.link}
                              onChange={(e) => handleHeroSlideChange(idx, "link", e.target.value)}
                              placeholder="e.g. /products?category=Wafers"
                              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50"
                            />
                          </div>

                        </div>

                        {/* Slide Quick Summary Card */}
                        <div className="p-4 bg-warm-bg/60 rounded-2xl border border-primary/15 space-y-1">
                          <div className="text-[11px] font-black uppercase tracking-wider text-primary">
                            Visitor Preview Note
                          </div>
                          <p className="text-xs text-muted font-medium leading-relaxed">
                            When users land on the home page, this banner will show with the headline &quot;<span className="font-bold text-heading">{slide.title}</span>&quot; and direct them to &quot;<span className="font-mono text-primary font-bold">{slide.link || "/products"}</span>&quot;.
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Bottom Floating/Fixed Save Bar */}
            {heroSlides.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-muted font-semibold">
                  You have <span className="font-black text-heading">{heroSlides.length}</span> active hero slides configured. Remember to click Save Changes to publish updates to your website.
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSaveHeroSlides()}
                    disabled={heroSubmitting}
                    className="flex-1 sm:flex-initial px-8 py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {heroSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving to MongoDB...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3px]" />
                        <span>Save All Banners</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}
