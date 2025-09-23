import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface for type checking
export interface IStore extends Document {
  userId: string;
  storeName: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  logoUrl?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const StoreSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true }, 
    storeName: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    tiktok: { type: String },
    logoUrl: { type: String }, 
    status: { type: String, default: "Active" },
  },
  { timestamps: true } 
);


export default mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);
