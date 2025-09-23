import mongoose from 'mongoose';

const dbConnect = async (): Promise<void> => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

export default dbConnect;