import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Store from "@/models/Store";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json(); // { storeName, description, phone, email, ... }

    // Save all form fields
    const updateData = {
      userId: user.id,
      status: "Active",
      storeName: data.storeName,
      description: data.description,
      phone: data.phone,
      email: data.email,
      address: data.address,
      website: data.website,
      facebook: data.facebook,
      instagram: data.instagram,
      twitter: data.twitter,
      tiktok: data.tiktok,
      logoUrl: data.logoBase64 ? `data:image/png;base64,${data.logoBase64}` : undefined
    };

    const store = await Store.findOneAndUpdate(
      { userId: user.id },
      updateData,
      { new: true, upsert: true }
    );

    console.log("✅ Store saved:", store);

    return NextResponse.json(store);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await Store.findOne({ userId: user.id });
    if (!store) return NextResponse.json({ message: "Store not found" }, { status: 404 });

    console.log("✅ Store found:", store);
    return NextResponse.json(store);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
