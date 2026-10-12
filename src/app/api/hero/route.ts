import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    imageSrc: "/hero_slides/slide_1.jpg",
    title: "100% Pure Groundnut Oil Wafers",
    subtitle: "Seasoned with mineral-rich rock salt (Sindhalu) for light, heart-healthy snacking.",
    buttonText: "Shop Wafers",
    link: "/products?category=Wafers"
  },
  {
    id: 2,
    imageSrc: "/hero_slides/slide_2.jpg",
    title: "Traditional Farali Specials",
    subtitle: "Fasting-safe treats like Pure Potato wafers prepared with pure ingredients.",
    buttonText: "Explore Farali",
    link: "/products?category=Farali+Specials"
  },
  {
    id: 3,
    imageSrc: "/hero_slides/slide_3.jpg",
    title: "Hand-Roasted Wheat Khakhra",
    subtitle: "Toasted on traditional clay tavas in small batches for authentic crunch.",
    buttonText: "Shop Khakhra",
    link: "/products?category=Khakhra"
  }
];

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pure_crunch_db");
    const doc = await db.collection("settings").findOne({ key: "hero_slides" });

    if (doc && Array.isArray(doc.slides) && doc.slides.length > 0) {
      return NextResponse.json(
        { success: true, slides: doc.slides },
        { headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, slides: DEFAULT_HERO_SLIDES },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Hero slides GET error:", error);
    return NextResponse.json(
      { success: true, slides: DEFAULT_HERO_SLIDES },
      { headers: NO_CACHE_HEADERS }
    );
  }
}

