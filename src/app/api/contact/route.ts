import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (phone) {
      const cleanedPhone = phone.replace(/\D/g, "");
      const phoneRegex = /^[6-9]\d{9}$/;
      if (cleanedPhone.length !== 10 || !phoneRegex.test(cleanedPhone)) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid 10-digit mobile number." },
          { status: 400 }
        );
      }
    }

    // Inquiries are not stored in MongoDB
    return NextResponse.json({ success: true, message: "Inquiry received successfully." });
  } catch (error) {
    console.error("Failed to process contact inquiry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry." },
      { status: 500 }
    );
  }
}
