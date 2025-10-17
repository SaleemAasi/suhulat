import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    time: { type: String, required: true }, // Format: HH:mm:ss
    status: { type: String, enum: ["Present", "Absent"], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", attendanceSchema);
