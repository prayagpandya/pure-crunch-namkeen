import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { SITE_CONFIG } from "@/data/config";

// Regular expressions for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, city, state, items, totalAmount } = body;

    // Validate Name
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    // Validate Phone (10 digits starting with 6-9)
    const sanitizedPhone = String(phone || "").replace(/\D/g, "");
    if (!PHONE_REGEX.test(sanitizedPhone)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    // Validate Email
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address (e.g. yourname@example.com)." },
        { status: 400 }
      );
    }

    // Validate City and State
    if (!city || typeof city !== "string" || city.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid city name." },
        { status: 400 }
      );
    }

    if (!state || typeof state !== "string" || state.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please select or enter your state." },
        { status: 400 }
      );
    }

    // Validate Items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your order does not contain any items." },
        { status: 400 }
      );
    }

    const parsedTotal = Number(totalAmount) || 0;

    // Helper to capitalize first letter of each word (e.g. "kevin" -> "Kevin", "rajkot" -> "Rajkot")
    const capitalizeWords = (str: string): string => {
      if (!str || typeof str !== "string") return "";
      return str
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    // Helper to capitalize first letter of string (e.g. "kevin@gmail.com" -> "Kevin@gmail.com")
    const capitalizeFirst = (str: string): string => {
      if (!str || typeof str !== "string") return "";
      const trimmed = str.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    };

    const formattedName = capitalizeWords(name);
    const formattedCity = capitalizeWords(city);
    const formattedState = capitalizeWords(state);
    const formattedEmail = capitalizeFirst(email);

    // Format clean, emoji-free WhatsApp message (prevents ? diamond symbols across devices)
    let message = `*NEW ORDER INQUIRY*\n`;
    message += `------------------------------------\n\n`;
    message += `*Customer Details:*\n`;
    message += `- *Name:* ${formattedName}\n`;
    message += `- *Phone:* +91 ${sanitizedPhone}\n`;
    message += `- *Email:* ${formattedEmail}\n`;
    message += `- *City/State:* ${formattedCity}, ${formattedState}\n\n`;

    message += `*Items Ordered:*\n`;
    items.forEach((item: any, idx: number) => {
      const itemPrice = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      const subtotal = itemPrice * qty;
      message += `${idx + 1}. *${item.name}* (${item.weight || "125 g"})\n`;
      message += `   Qty: ${qty} x Rs. ${itemPrice.toFixed(2)} = *Rs. ${subtotal.toFixed(2)}*\n`;
    });

    message += `\n------------------------------------\n`;
    message += `*Total Amount:* Rs. ${parsedTotal.toFixed(2)}\n`;
    message += `------------------------------------\n\n`;
    message += `Please confirm my order availability and share payment & delivery instructions. Thank you!`;

    const rawWhatsappNumber = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${rawWhatsappNumber}?text=${encodeURIComponent(message)}`;

    // Store order record in MongoDB
    try {
      const client = await clientPromise;
      const db = client.db("pure_crunch_db");
      await db.collection("orders").insertOne({
        customer: {
          name: formattedName,
          phone: sanitizedPhone,
          email: email.trim().toLowerCase(),
          city: formattedCity,
          state: formattedState,
        },
        items: items.map((i: any) => ({
          name: i.name,
          weight: i.weight || "125 g",
          quantity: Number(i.quantity) || 1,
          price: Number(i.price) || 0,
        })),
        totalAmount: parsedTotal,
        channel: "whatsapp",
        status: "inquiry_sent",
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.warn("MongoDB order logging error (proceeding to WhatsApp anyway):", dbError);
    }

    return NextResponse.json({
      success: true,
      whatsappUrl,
      message: "Order formatted successfully",
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order. Please try again." },
      { status: 500 }
    );
  }
}
