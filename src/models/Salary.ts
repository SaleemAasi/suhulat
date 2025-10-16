import mongoose, { Schema, Document } from "mongoose";

export interface ISalary extends Document {
  employeeId: mongoose.Schema.Types.ObjectId;
  name: string;
  designation: string;
  basicSalary: number;
  bonus: number;
  advance: number;
  deductions: number;
  month: string;
  netSalary: number;
}

const SalarySchema = new Schema<ISalary>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    basicSalary: { type: Number, required: true },
    bonus: { type: Number, default: 0 },
    advance: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    month: { type: String, required: true },
    netSalary: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Salary || mongoose.model<ISalary>("Salary", SalarySchema);
