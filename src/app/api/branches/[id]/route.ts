import { NextResponse } from "next/server";
import mongoose, { Document, Model } from "mongoose";

// Connect to MongoDB
if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.MONGODB_URI || "");
}

// Branch interface
interface IBranch extends Document {
  name: string;
  manager: mongoose.Types.ObjectId | { _id: string; name: string };
}

// Branch Schema
const BranchSchema = new mongoose.Schema<IBranch>({
  name: { type: String, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Explicitly type the model
const Branch: Model<IBranch> = mongoose.models.Branch || mongoose.model<IBranch>("Branch", BranchSchema);

// ✅ Delete branch
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // TypeScript now knows Branch is a Model<IBranch>
    const deleted = await Branch.findByIdAndDelete(id).exec();

    if (!deleted) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Branch deleted", id: deleted._id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
