import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import fs from "fs";
import path from "path";

// GET all products
export async function GET() {
  await connectDB();
  try {
    const products = await Product.find({})
      .populate("branches", "name")
      .lean();
    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create product
export async function POST(req: Request) {
  await connectDB();
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const stock = Number(formData.get("stock") || 0);
    const price = Number(formData.get("price") || 0);
    const unit = formData.get("unit") as string;
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;
    const size = formData.get("size") as string;
    const branches = formData.getAll("branches") as string[];

    // Handle images
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const files = formData.getAll("images");
    const images: string[] = [];
    for (const file of files) {
      if (file instanceof File) {
        const bytes = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;
        fs.writeFileSync(path.join(uploadsDir, fileName), bytes);
        images.push(`/uploads/${fileName}`);
      }
    }

    const product = await Product.create({
      name,
      category,
      stock,
      price,
      unit,
      description,
      color,
      size,
      branches,
      images,
      imageUrl: images[0] || null,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
