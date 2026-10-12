import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "pure_crunch_admin_session";

// Generate a deterministic token from the current ADMIN_PASSWORD and a salt
function getExpectedToken(): string {
  const adminPassword = process.env.ADMIN_PASSWORD || "purecrunch@admin123";
  return crypto.createHash("sha256").update(`pure-crunch-salt:${adminPassword}`).digest("hex");
}

export function createAdminToken(): string {
  return getExpectedToken();
}

export function getAdminCookieName(): string {
  return COOKIE_NAME;
}

export async function verifyAdminRequest(req?: NextRequest): Promise<boolean> {
  const expected = getExpectedToken();

  // Check Authorization header first if present
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token === expected) return true;
    }
  }

  // Check cookies
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (sessionCookie && sessionCookie.value === expected) {
      return true;
    }
  } catch {
    // If outside request context or headers already flushed
  }

  return false;
}
