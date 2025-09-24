// app/api/users/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ✅ Connect to MongoDB
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI || "")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// ✅ Define Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["Manager", "Owner", "Cashier", "Admin"] },
});

// ✅ Always overwrite old cached model
mongoose.models.User && delete mongoose.models.User;
const User = mongoose.model("User", UserSchema);

// ✅ POST - create user
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // ✅ Hash password before saving
    const hashedPassword = bcrypt.hashSync(body.password, 10);

    const newUser = await User.create({ ...body, password: hashedPassword });
    console.log("✅ User saved:", newUser);

    // Don't return password to client
    const { password, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json(userWithoutPassword);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ GET - fetch all users
export async function GET() {
  try {
    const users = await User.find({}, { password: 0 }).lean();
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
