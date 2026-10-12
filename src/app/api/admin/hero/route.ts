import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { DEFAULT_HERO_SLIDES } from "@/app/api/hero/route";

export async function GET(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const doc = await db.collection("settings").findOne({ key: "hero_slides" });

    if (doc && Array.isArray(doc.slides) && doc.slides.length > 0) {
      return NextResponse.json({ success: true, slides: doc.slides });
    }

    return NextResponse.json({ success: true, slides: DEFAULT_HERO_SLIDES });
  } catch (error) {
    console.error("Admin hero slides GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch hero slides" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slides } = body;

    if (!Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one hero banner slide is required." },
        { status: 400 }
      );
    }

    // Sanitize and validate slide items
    const sanitizedSlides = slides.map((slide: any, idx: number) => ({
      id: Number(slide.id) || idx + 1,
      imageSrc: String(slide.imageSrc || "").trim() || "/hero_slides/slide_1.jpg",
      title: String(slide.title || "").trim() || "Pure Crunch Healthy Namkeen",
      subtitle: String(slide.subtitle || "").trim() || "Crafted in 100% Pure Groundnut Oil",
      buttonText: String(slide.buttonText || "").trim() || "Explore Snacks",
      link: String(slide.link || "").trim() || "/products",
    }));

    const client = await clientPromise;
    const db = client.db("pure_crunch_db");

    await db.collection("settings").updateOne(
      { key: "hero_slides" },
      { 
        $set: { 
          key: "hero_slides", 
          slides: sanitizedSlides, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Hero section slides updated successfully",
      slides: sanitizedSlides,
    });
  } catch (error) {
    console.error("Admin hero slides PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update hero slides" }, { status: 500 });
  }
}
