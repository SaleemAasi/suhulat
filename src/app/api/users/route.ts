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

    if (!body.role) return NextResponse.json({ error: "Role is required" }, { status: 400 });

    // Hash password
    const hashedPassword = bcrypt.hashSync(body.password, 10);

    const newUser = await User.create({ ...body, password: hashedPassword });
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

// ✅ PUT - update user
export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // get id from /api/users/:id
    const body = await req.json();

    if (body.password) body.password = bcrypt.hashSync(body.password, 10); // hash if updating password

    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true }).select("-password");
    return NextResponse.json(updatedUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE - remove user
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // get id from /api/users/:id

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
