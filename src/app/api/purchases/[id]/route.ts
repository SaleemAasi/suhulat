import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Purchase from "@/models/Purchase";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const { id } = params;
    const purchase = await Purchase.findByIdAndDelete(id);
    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Purchase deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const { id } = params;
    const purchase = await Purchase.findById(id).populate("product").populate("branch");
    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }
    return NextResponse.json(purchase, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// You can also add PATCH if you want update functionality
