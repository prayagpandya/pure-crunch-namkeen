import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { PRODUCTS } from "@/data/products";

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
    const products = await db.collection("products").find({}).toArray();

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: true, source: "fallback", data: PRODUCTS },
        { headers: NO_CACHE_HEADERS }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sanitized = products.map(({ _id, ...rest }) => rest);
    return NextResponse.json(
      { success: true, source: "mongodb", data: sanitized },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Failed to fetch products from MongoDB:", error);
    return NextResponse.json(
      { success: true, source: "fallback", data: PRODUCTS },
      { headers: NO_CACHE_HEADERS }
    );
  }
}

