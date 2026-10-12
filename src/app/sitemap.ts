import type { MetadataRoute } from "next";
import clientPromise from "@/lib/mongodb";
import { PRODUCTS, CATEGORIES } from "@/data/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.purecrunch.co.in";
  const now = new Date();

  // 1. Core Primary Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // 2. Category Filter URLs
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 3. Dynamic Products (Fetched from MongoDB with static PRODUCTS fallback)
  let productEntries: MetadataRoute.Sitemap = [];

  try {
    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const dbProducts = await db
      .collection("products")
      .find({}, { projection: { id: 1, updatedAt: 1, createdAt: 1 } })
      .toArray();

    if (dbProducts && dbProducts.length > 0) {
      productEntries = dbProducts.map((p) => ({
        url: `${baseUrl}/products/${p.id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : p.createdAt ? new Date(p.createdAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.warn("MongoDB sitemap query fallback to static PRODUCTS:", err);
  }

  // If DB was empty or failed, use static PRODUCTS
  if (productEntries.length === 0) {
    productEntries = PRODUCTS.map((p) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  return [...staticRoutes, ...categoryRoutes, ...productEntries];
}
