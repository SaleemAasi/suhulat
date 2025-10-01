import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// GET single product
export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(params.id).populate("branches", "name");
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(product, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT update product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const formData = await req.formData();

    // ✅ Convert branches → ObjectId
    const branchValues = formData.getAll("branches") as string[];
    const branches = branchValues
      .filter((b) => !!b && mongoose.Types.ObjectId.isValid(b))
      .map((bid) => new mongoose.Types.ObjectId(bid));

    const update: any = {
      name: formData.get("name"),
      category: formData.get("category"),
      stock: Number(formData.get("stock") || 0),
      price: Number(formData.get("price") || 0),
      unit: formData.get("unit"),
      description: formData.get("description"),
      color: formData.get("color"),
      size: formData.get("size"),
      branches,
    };

    // ✅ Handle new images (optional update)
    const files = formData.getAll("images");
    if (files.length > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const images: string[] = [];
      for (const file of files) {
        if (file instanceof File) {
          const bytes = Buffer.from(await file.arrayBuffer());
          const fileName = `${Date.now()}-${file.name}`;
          fs.writeFileSync(path.join(uploadsDir, fileName), bytes);
          images.push(`/uploads/${fileName}`);
        }
      }
      update.images = images;
      update.imageUrl = images[0] || null;
    }

    const product = await Product.findByIdAndUpdate(params.id, update, { new: true })
      .populate("branches", "name");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
