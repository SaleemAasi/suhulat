// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import fs from "fs";
import path from "path";

// DELETE a product
export async function DELETE(req: NextRequest, context: any) {
  await dbConnect();
  const params = await context.params; // await params
  const id = params.id;

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET a single product
export async function GET(req: NextRequest, context: any) {
  await dbConnect();
  const params = await context.params;
  const id = params.id;

  try {
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE a product
export async function PUT(req: NextRequest, context: any) {
  await dbConnect();
  const params = await context.params;
  const id = params.id;

  try {
    const formData = await req.formData();

    const update: any = {
      name: formData.get("name"),
      category: formData.get("category"),
      stock: Number(formData.get("stock")),
      price: Number(formData.get("price")),
      unit: formData.get("unit"),
      description: formData.get("description"),
      color: formData.get("color"),
      size: formData.get("size"),
    };

    const uploadDir = path.join(process.cwd(), "public/uploads");
    fs.mkdirSync(uploadDir, { recursive: true });

    const newImages: string[] = [];
    const files = formData.getAll("images") as File[];

    for (const file of files) {
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, filename);
        await fs.promises.writeFile(filePath, buffer);
        newImages.push("/uploads/" + filename);
      }
    }

    if (newImages.length > 0) update.images = newImages;

    const product = await Product.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
