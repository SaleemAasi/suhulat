import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  stock: number;
  price: number;
  unit: string;
  description: string;
  color: string;
  size: string;
  images: string[];
  status: string;
}


 const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  description: String,
  color: String,
  size: String,
  images: [String],
  status: { type: String, default: "Draft" }
});


const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
