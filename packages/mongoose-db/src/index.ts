import mongoose from 'mongoose';

export * from './service/orderService'
export * from './service/pathService'
export * from './service/driverService'

const mongoURL = process.env.MONGO_DB_URL??'mongodb://localhost:27017/mydb';

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};