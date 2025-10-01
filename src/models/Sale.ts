import mongoose, { Schema, Document } from "mongoose";

export interface ISale extends Document {
  product: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  quantity: number;
  total: number;
  date: Date;
}

const SaleSchema = new Schema<ISale>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Sale || mongoose.model<ISale>("Sale", SaleSchema);
