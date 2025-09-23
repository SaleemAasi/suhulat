import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Connect to MongoDB
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI || "");
}

// Branch Schema
const BranchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Use existing model if available, otherwise create a new one
const Branch = mongoose.models.Branch || mongoose.model("Branch", BranchSchema);

// GET all branches
export async function GET() {
  try {
    const branches = await Branch.find({}).populate("manager", "name").lean();
    return NextResponse.json(branches);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create branch
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.manager) {
      return NextResponse.json({ error: "Name and manager are required" }, { status: 400 });
    }

    const branch = await Branch.create({
      name: body.name,
      manager: new mongoose.Types.ObjectId(body.manager),
    });

    const populatedBranch = await branch.populate("manager", "name");

    console.log("Saved branch:", populatedBranch);
    return NextResponse.json(populatedBranch);
  } catch (err: any) {
    console.error("Failed to create branch:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
