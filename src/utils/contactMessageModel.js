import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }, // New phone number field
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
