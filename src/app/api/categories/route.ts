import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { CATEGORIES } from "@/data/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const doc = await db.collection("categories").findOne({ key: "product_categories" });

    if (doc && Array.isArray(doc.categories) && doc.categories.length > 0) {
      return NextResponse.json(
        { success: true, categories: doc.categories.filter((c: string) => c !== "Shop All") },
        { headers: NO_CACHE_HEADERS }
      );
    }
  } catch (error) {
    console.error("Error fetching categories from MongoDB:", error);
  }

  return NextResponse.json(
    { success: true, categories: CATEGORIES.filter((c: string) => c !== "Shop All") },
    { headers: NO_CACHE_HEADERS }
  );
}

