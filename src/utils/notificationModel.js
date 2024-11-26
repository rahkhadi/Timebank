import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
        message: { type: String, required: true },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
