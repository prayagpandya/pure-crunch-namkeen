import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const isAuth = await verifyAdminRequest(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const fallbackFiles = formData.getAll("file") as File[];
    const rawFiles = files.length > 0 ? files : fallbackFiles;

    const validFiles = rawFiles.filter(
      (f): f is File => f && typeof f === "object" && typeof f.arrayBuffer === "function" && f.size > 0
    );

    if (validFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No image files provided in upload request." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of validFiles) {
      // Validate file type
      const isImage =
        file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(file.name);
      if (!isImage) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" is not a supported image format.` },
          { status: 400 }
        );
      }

      // Max size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" exceeds the 10MB size limit.` },
          { status: 400 }
        );
      }

      // Determine clean extension
      const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";

      // Sanitize base name
      const rawBase = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 25);
      const cleanBase = rawBase || "photo";
      const filename = `snack_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanBase}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        await fs.writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${filename}`);
      } catch (writeError) {
        console.warn("Direct filesystem write failed, using data URL fallback:", writeError);
        const mime = file.type || "image/jpeg";
        uploadedUrls.push(`data:${mime};base64,${buffer.toString("base64")}`);
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0] || "",
      count: uploadedUrls.length,
      message: `${uploadedUrls.length} image(s) uploaded successfully.`
    });
  } catch (error) {
    console.error("Admin upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image(s). Please try again." },
      { status: 500 }
    );
  }
}
