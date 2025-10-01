import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Purchase from "@/models/Purchase";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();
  try {
    const purchases = await Purchase.find({})
      .populate("product", "name price stock")
      .populate("branch", "name")
      .lean();
    return NextResponse.json(purchases);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const { product, branch, quantity, total } = await req.json();

    const prod = await Product.findById(product);
    if (!prod) throw new Error("Product not found");

    if (quantity > prod.stock)
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });

    prod.stock -= quantity;
    await prod.save();

    const purchase = await Purchase.create({ product, branch, quantity, total });
    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate("product", "name price")
      .populate("branch", "name");

    return NextResponse.json(populatedPurchase, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const id = params.id;
    const purchase = await Purchase.findByIdAndDelete(id);
    if (!purchase) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // restore product stock
    const prod = await Product.findById(purchase.product);
    if (prod) {
      prod.stock += purchase.quantity;
      await prod.save();
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
