import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    timeCoins: { type: Number, required: true },
    imageUrl: { type: String }, // Store relative path to the image
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);
