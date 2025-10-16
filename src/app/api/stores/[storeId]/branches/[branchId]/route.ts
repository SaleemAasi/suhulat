import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Branch from "@/models/Branch";
import { verifyAuth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ storeId: string; branchId: string }> }
) {
  try {
    console.log("✅ DELETE branch called");
    await dbConnect();

    const { storeId, branchId } = await context.params; // ✅ must await
    console.log("StoreId:", storeId, "BranchId:", branchId);

    const user = await verifyAuth(req);
    console.log("User:", user);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deleted = await Branch.findOneAndDelete({ _id: branchId, store: storeId });
    console.log("Deleted branch:", deleted);

    if (!deleted)
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });

    return NextResponse.json({ id: deleted._id });
  } catch (err: any) {
    console.error("DELETE branch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ storeId: string; branchId: string }> }
) {
  try {
    console.log("✅ PUT branch called");
    await dbConnect();

    const { storeId, branchId } = await context.params; // ✅ must await
    console.log("StoreId:", storeId, "BranchId:", branchId);

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    console.log("PUT request body:", data);

    const updated = await Branch.findOneAndUpdate(
      { _id: branchId, store: storeId },
      data,
      { new: true }
    ).populate("manager", "name");

    if (!updated) return NextResponse.json({ error: "Branch not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PUT branch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
