import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { PRODUCTS } from "@/data/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const product = await db.collection("products").findOne({ id });

    if (product) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...rest } = product;
      return NextResponse.json(
        { success: true, data: rest },
        { headers: NO_CACHE_HEADERS }
      );
    }
  } catch (error) {
    console.error(`Error fetching product '${id}' from MongoDB:`, error);
  }

  const fallback = PRODUCTS.find((p) => p.id === id);
  if (fallback) {
    return NextResponse.json(
      { success: true, data: fallback },
      { headers: NO_CACHE_HEADERS }
    );
  }

  return NextResponse.json(
    { success: false, error: "Product not found" },
    { status: 404, headers: NO_CACHE_HEADERS }
  );
}

