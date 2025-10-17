import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Attendance from "@/models/Attendance";
import Employee from "@/models/Employee";

// ✅ MongoDB Connection
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI || "")
    .then(() => console.log("✅ MongoDB connected for attendance"))
    .catch((err) => console.error("❌ MongoDB error:", err));
}

// ✅ POST - Mark Attendance
export async function POST(req: Request) {
  try {
    const { employeeId, status } = await req.json();

    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    // ✅ Verify Employee Exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    // ✅ Check if already marked today
    const existing = await Attendance.findOne({ employeeId, date });
    if (existing) {
      return NextResponse.json(
        { message: "Attendance already marked for today" },
        { status: 400 }
      );
    }

    // ✅ Create Attendance Record
    const attendance = await Attendance.create({ employeeId, status, date, time });
    return NextResponse.json(attendance);
  } catch (err: any) {
    console.error("❌ POST /attendance Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ GET - Get All Attendance Records
export async function GET() {
  try {
    const records = await Attendance.find()
      .populate("employeeId", "name designation")
      .sort({ date: -1 });
    return NextResponse.json(records);
  } catch (err: any) {
    console.error("❌ GET /attendance Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
