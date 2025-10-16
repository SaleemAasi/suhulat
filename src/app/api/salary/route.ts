import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Salary from "@/models/Salary";

export async function GET() {
  await dbConnect();
  try {
    const salaries = await Salary.find().populate("employeeId", "name designation salary");
    return NextResponse.json(salaries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.json();
    const netSalary =
      Number(data.basicSalary) + Number(data.bonus) - Number(data.advance) - Number(data.deductions);

    const newSalary = await Salary.create({
      ...data,
      netSalary,
    });

    return NextResponse.json(newSalary, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
