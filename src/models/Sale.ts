import mongoose, { Schema, Document } from "mongoose";

export interface ISaleItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
}

export interface ISale extends Document {
  branch: mongoose.Types.ObjectId;
  items: ISaleItem[];
  subtotal: number;
  discount: number;
  discountType: "percent" | "amount";
  tax: number;
  total: number;
  date: Date;
}

const SaleItemSchema = new Schema<ISaleItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const SaleSchema = new Schema<ISale>(
  {
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    items: { type: [SaleItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountType: { type: String, enum: ["percent", "amount"], default: "percent" },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Sale || mongoose.model<ISale>("Sale", SaleSchema);
