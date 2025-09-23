import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Store from "@/models/Store";

// GET store by userId
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await dbConnect();
    const { userId } = params;
    const store = await Store.findOne({ userId });
    if (!store) return NextResponse.json({ message: "Store not found" }, { status: 404 });
    return NextResponse.json(store);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST / update store
export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await dbConnect();
    const { userId } = params;
    const data = await req.formData();

    const logoFile = data.get("logo") as File | null;

    const updateData: any = {};
    for (const [key, value] of data.entries()) {
      if (key !== "logo") updateData[key] = value;
    }

    // Handle logo upload
    if (logoFile && logoFile.size > 0) {
      // Save file to /public/uploads (make sure folder exists)
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      const fileName = `${Date.now()}-${logoFile.name}`;
      const fs = require("fs");
      const path = require("path");
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      updateData.logoUrl = `/uploads/${fileName}`;
    }

    // Update or create store
    const store = await Store.findOneAndUpdate(
      { userId },
      
      updateData,
      { new: true, upsert: true }
    );

    return NextResponse.json(store);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
