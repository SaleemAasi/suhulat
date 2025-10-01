import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sale from "@/models/Sale";
import mongoose from "mongoose";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid sale ID" }, { status: 400 });
    }

    const deleted = await Sale.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
