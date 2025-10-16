import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Employee from "@/models/Employee";

export async function GET(req: NextRequest, { params }: any) {
  await dbConnect();
  const employee = await Employee.findById(params.id);
  if (!employee) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(employee);
}

export async function PUT(req: NextRequest, { params }: any) {
  await dbConnect();
  const data = await req.json();
  const updated = await Employee.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: any) {
  await dbConnect();
  await Employee.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted successfully" });
}
