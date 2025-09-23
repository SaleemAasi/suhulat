import { SignJWT } from "jose";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  const { email, password } = await req.json();
  await dbConnect();

  const user = await User.findOne({ email });
  const users = await User.find();
  console.log(users);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const userData = {
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
  const token = await new SignJWT(userData)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);

  return NextResponse.json({ user: userData, token });
}
