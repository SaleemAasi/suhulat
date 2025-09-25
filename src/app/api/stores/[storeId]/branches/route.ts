import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Branch from "@/models/Branch";
import { verifyAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const branches = await Branch.find({ store: params.storeId }).populate("manager", "name");
    return NextResponse.json(branches);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const branch = await Branch.create({
      name: data.name,
      manager: data.manager,
      store: params.storeId,
    });

    const populated = await branch.populate("manager", "name");
    return NextResponse.json(populated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
