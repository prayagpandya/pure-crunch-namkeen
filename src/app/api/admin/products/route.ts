import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { Product } from "@/data/products";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export async function GET(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const products = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sanitized = products.map(({ _id, ...rest }) => rest);
    return NextResponse.json({ success: true, products: sanitized, count: sanitized.length });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      id: rawId,
      category,
      subcategory,
      mrp,
      weight,
      image,
      ingredients,
      description,
      features,
      funFact,
      isPopular,
      isFarali,
      nutritionInfo
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ success: false, error: "Category is required" }, { status: 400 });
    }
    if (mrp === undefined || isNaN(Number(mrp))) {
      return NextResponse.json({ success: false, error: "Valid price (MRP) is required" }, { status: 400 });
    }

    const id = (rawId && rawId.trim()) ? generateSlug(rawId) : generateSlug(name);
    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const productsCol = db.collection("products");

    // Check if ID already exists
    const existing = await productsCol.findOne({ id });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `A product with slug '${id}' already exists. Please choose another name or slug.` },
        { status: 409 }
      );
    }

    // Process ingredients & features arrays
    const ingredientsArr = Array.isArray(ingredients)
      ? ingredients
      : typeof ingredients === "string"
        ? ingredients.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

    const featuresArr = Array.isArray(features)
      ? features
      : typeof features === "string"
        ? features.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

    // Normalize multiple photos array
    const imagesArr: string[] = Array.isArray(body.images)
      ? body.images.map((s: any) => String(s).trim()).filter(Boolean)
      : typeof body.images === "string"
        ? body.images.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

    const primaryImage = (image && image.trim())
      ? image.trim()
      : (imagesArr.length > 0 ? imagesArr[0] : "/products/plain-salty.jpg");

    if (primaryImage && !imagesArr.includes(primaryImage)) {
      imagesArr.unshift(primaryImage);
    }

    const now = new Date();
    const newProduct: Product & { createdAt: Date; updatedAt: Date } = {
      id,
      name: name.trim(),
      category: category as any,
      subcategory: (subcategory || category) as any,
      mrp: Number(mrp),
      weight: (weight && weight.trim()) ? weight.trim() : "125 g",
      image: primaryImage,
      images: imagesArr,
      ingredients: ingredientsArr.length > 0 ? ingredientsArr : ["100% Pure Groundnut Oil", "Authentic Spices"],
      description: description?.trim() || `Authentic, crunchy ${name.trim()} crafted in 100% pure groundnut oil in small batches.`,
      features: featuresArr.length > 0 ? featuresArr : ["100% Pure Groundnut Oil", "Small Batch Frying"],
      isPopular: false,
      isFarali: Boolean(isFarali),
      rating: 4.8,
      reviewCount: 0,
      funFact: funFact?.trim() || `${name.trim()} is prepared fresh daily with no added preservatives!`,
      nutritionInfo: nutritionInfo || {
        energy: "540 kcal",
        protein: "6.5 g",
        carbohydrates: "52 g",
        fat: "34 g",
        sodium: "580 mg"
      },
      reviews: [],
      createdAt: now,
      updatedAt: now
    };

    await productsCol.insertOne(newProduct as any);

    return NextResponse.json({ success: true, message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();

    if (!id) {
      return NextResponse.json({ success: false, error: "Product id is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const result = await db.collection("products").deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Product '${id}' deleted successfully` });
  } catch (error) {
    console.error("Admin products DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      name,
      category,
      subcategory,
      mrp,
      weight,
      image,
      ingredients,
      description,
      features,
      funFact,
      isFarali,
      nutritionInfo
    } = body;

    if (!id || !id.trim()) {
      return NextResponse.json({ success: false, error: "Product ID is required for editing" }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ success: false, error: "Category is required" }, { status: 400 });
    }
    if (mrp === undefined || isNaN(Number(mrp))) {
      return NextResponse.json({ success: false, error: "Valid price (MRP) is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const productsCol = db.collection("products");

    // Process ingredients & features arrays
    const ingredientsArr = Array.isArray(ingredients)
      ? ingredients
      : typeof ingredients === "string"
        ? ingredients.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

    const featuresArr = Array.isArray(features)
      ? features
      : typeof features === "string"
        ? features.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

    // Normalize multiple photos array
    const imagesArr: string[] = Array.isArray(body.images)
      ? body.images.map((s: any) => String(s).trim()).filter(Boolean)
      : typeof body.images === "string"
        ? body.images.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

    const primaryImage = (image && image.trim())
      ? image.trim()
      : (imagesArr.length > 0 ? imagesArr[0] : "/products/plain-salty.jpg");

    if (primaryImage && !imagesArr.includes(primaryImage)) {
      imagesArr.unshift(primaryImage);
    }

    const updatedDoc: Partial<Product> & { updatedAt: Date } = {
      name: name.trim(),
      category: category as any,
      subcategory: (subcategory || category) as any,
      mrp: Number(mrp),
      weight: (weight && weight.trim()) ? weight.trim() : "125 g",
      image: primaryImage,
      images: imagesArr,
      ingredients: ingredientsArr.length > 0 ? ingredientsArr : ["100% Pure Groundnut Oil", "Authentic Spices"],
      description: description?.trim() || `Authentic, crunchy ${name.trim()} crafted in 100% pure groundnut oil in small batches.`,
      features: featuresArr.length > 0 ? featuresArr : ["100% Pure Groundnut Oil", "Small Batch Frying"],
      isPopular: false,
      isFarali: Boolean(isFarali),
      funFact: funFact?.trim() || `${name.trim()} is prepared fresh daily with no added preservatives!`,
      nutritionInfo: nutritionInfo || {
        energy: "540 kcal",
        protein: "6.5 g",
        carbohydrates: "52 g",
        fat: "34 g",
        sodium: "580 mg"
      },
      updatedAt: new Date()
    };

    await productsCol.updateOne(
      { id: id.trim() },
      { 
        $set: updatedDoc,
        $setOnInsert: {
          id: id.trim(),
          rating: 4.8,
          reviewCount: 0,
          reviews: [],
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Product updated successfully", 
      product: { id: id.trim(), ...updatedDoc } 
    });
  } catch (error) {
    console.error("Admin products PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

