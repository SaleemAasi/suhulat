// models/Product.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  stock: number;
  price: number;
  unit: string;
  description?: string;
  color: string;
  size: string;
  status?: string;
  imageUrl?: string;   
  images?: string[];   
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    description: String,
    color: String,
    size: String,
    status: { type: String, default: "Draft" },
    imageUrl: String,
    images: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
