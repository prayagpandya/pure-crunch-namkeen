import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { CATEGORIES } from "@/data/products";

export async function GET(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const doc = await db.collection("categories").findOne({ key: "product_categories" });
    const rawCategories: string[] = doc?.categories || CATEGORIES;
    const categories = rawCategories.filter((c: string) => c !== "Shop All");
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Admin categories GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const categoriesCol = db.collection("categories");

    // Add category using $addToSet to avoid duplicates
    await categoriesCol.updateOne(
      { key: "product_categories" },
      { 
        $addToSet: { categories: name },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    const updatedDoc = await categoriesCol.findOne({ key: "product_categories" });
    return NextResponse.json({ success: true, categories: updatedDoc?.categories });
  } catch (error) {
    console.error("Admin categories POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to add category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name")?.trim();

    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const categoriesCol = db.collection("categories");

    await categoriesCol.updateOne(
      { key: "product_categories" },
      { 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        $pull: { categories: name } as any,
        $set: { updatedAt: new Date() }
      }
    );

    const updatedDoc = await categoriesCol.findOne({ key: "product_categories" });
    return NextResponse.json({ success: true, categories: updatedDoc?.categories });
  } catch (error) {
    console.error("Admin categories DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
