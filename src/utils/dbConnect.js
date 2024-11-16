import mongoose from 'mongoose';

const dbConnect = async () => {
    const mongoUri = process.env.MONGODB_URI;
    console.log('MONGODB_URI:', mongoUri); // Debugging

    if (!mongoUri) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw new Error('MongoDB connection failed');
    }
};

export default dbConnect;
