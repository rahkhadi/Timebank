// src/utils/transactionModel.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to User schema
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to User schema
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String, // Optional description of the transaction
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
