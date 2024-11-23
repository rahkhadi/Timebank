import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    timeCoins: { type: Number, required: true },
    imageUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who created the request
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who accepted the request
    createdAt: { type: Date, default: Date.now },
});

const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);
export default Request;