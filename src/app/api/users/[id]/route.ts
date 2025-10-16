import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Connect to MongoDB
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI || "");
}

// Define Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["Manager", "Owner", "Cashier", "Admin"] },
  salary: { type: Number, required: true, default: 0 },
});

if (mongoose.models.User) delete mongoose.models.User;
const User = mongoose.model("User", UserSchema);

// ✅ PUT - update user
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (body.password) {
      body.password = bcrypt.hashSync(body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true }).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE - remove user
export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully", id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
