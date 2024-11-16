import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    timeCoins: { type: Number, required: true },
    imageUrl: { type: String },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);
export default Request;
