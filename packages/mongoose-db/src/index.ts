import mongoose from 'mongoose';

export * from './service/orderService'
export * from './service/pathService'

const mongoURL = 'mongodb://localhost:27017/harkirat';

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};