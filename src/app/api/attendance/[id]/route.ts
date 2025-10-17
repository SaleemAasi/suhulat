import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Attendance from "@/models/Attendance";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI || "");
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const records = await Attendance.find({ employeeId: params.id })
      .sort({ date: -1, time: -1 });
    return NextResponse.json(records);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
