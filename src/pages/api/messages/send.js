// src/pages/api/messages/send.js
import dbConnect from "@/utils/dbConnect";
import Message from "@/utils/messageModel";

dbConnect();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { sender, receiver, content } = req.body;

        // Validate required fields
        if (!sender || !receiver || !content) {
            return res.status(400).json({ success: false, error: "All fields are required." });
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
