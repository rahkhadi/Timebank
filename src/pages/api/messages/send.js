import dbConnect from "@/utils/dbConnect";
import Message from "@/utils/messageModel";
import mongoose from "mongoose";

dbConnect();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { sender, receiver, content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({ success: false, error: "Invalid user IDs." });
        }

        if (!content) {
            return res.status(400).json({ success: false, error: "Message content cannot be empty." });
        }

        try {
            const message = await Message.create({ sender, receiver, content });
            res.status(201).json({ success: true, message });
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).json({ success: false, error: "Failed to send message." });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
