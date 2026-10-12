import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, getAdminCookieName, verifyAdminRequest } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    const envPassword = process.env.ADMIN_PASSWORD || "purecrunch@admin123";

    if (!password || password.trim() !== envPassword.trim()) {
      return NextResponse.json(
        { success: false, error: "Incorrect admin password" },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      token
    });

    response.cookies.set({
      name: getAdminCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during login" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  return NextResponse.json({ authenticated: isAuth });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: getAdminCookieName(),
    value: "",
    maxAge: 0,
    path: "/",
  });
  return response;
}
