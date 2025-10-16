import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Salary from "@/models/Salary";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const data = await req.json();
    const netSalary =
      Number(data.basicSalary) + Number(data.bonus) - Number(data.advance) - Number(data.deductions);

    const updated = await Salary.findByIdAndUpdate(
      params.id,
      { ...data, netSalary },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    await Salary.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Salary record deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
