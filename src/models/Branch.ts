import mongoose, { Document, Model } from "mongoose";

export interface IBranch extends Document {
  name: string;
  manager: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
}

const BranchSchema = new mongoose.Schema<IBranch>(
  {
    name: { type: String, required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  },
  { timestamps: true }
);

const Branch: Model<IBranch> =
  mongoose.models.Branch || mongoose.model<IBranch>("Branch", BranchSchema);

export default Branch;
