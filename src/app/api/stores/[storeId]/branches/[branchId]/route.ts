import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Branch from "@/models/Branch";
import { verifyAuth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ storeId: string; branchId: string }> } // 👈 params is async
) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { storeId, branchId } = await context.params; // 👈 await here
    const data = await req.json();

    const updated = await Branch.findOneAndUpdate(
      { _id: branchId, store: storeId },
      data,
      { new: true }
    ).populate("manager", "name");

    if (!updated) return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ storeId: string; branchId: string }> }
) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { storeId, branchId } = await context.params; // 👈 await here

    const deleted = await Branch.findOneAndDelete({
      _id: branchId,
      store: storeId,
    });

    if (!deleted) return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    return NextResponse.json({ id: deleted._id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
