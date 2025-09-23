import mongoose, { Schema, Model, Types } from 'mongoose';
import { IUser } from '@/types/IUser';

export interface IUserDocument extends Omit<IUser, '_id'> {
  _id: Types.ObjectId;
  password: string; 
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true }, // stays in DB only
    role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
  },
  { timestamps: true }
);

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);

export default User;
