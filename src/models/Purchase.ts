import mongoose, { Schema, model, models } from "mongoose";

const purchaseSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Purchase = models.Purchase || model("Purchase", purchaseSchema);
export default Purchase;
