import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI!;
        await mongoose.connect(uri);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
