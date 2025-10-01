import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sale from "@/models/Sale";

export async function GET() {
  await connectDB();
  try {
    const sales = await Sale.find({})
      .populate("product", "name price")
      .populate("branch", "name")
      .lean();

    return NextResponse.json(sales, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { product, branch, quantity, total } = body;

    const sale = await Sale.create({ product, branch, quantity, total });
    const populatedSale = await Sale.findById(sale._id)
      .populate("product", "name price")
      .populate("branch", "name");

    return NextResponse.json(populatedSale, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
