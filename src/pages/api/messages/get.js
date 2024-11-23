// src/pages/api/messages/get.js
import dbConnect from "@/utils/dbConnect";
import Message from "@/utils/messageModel";

dbConnect();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { user1, user2 } = req.query;

        if (!user1 || !user2) {
            return res.status(400).json({ success: false, error: "Both user IDs are required." });
        }

        try {
            const messages = await Message.find({
                $or: [
                    { sender: user1, receiver: user2 },
                    { sender: user2, receiver: user1 },
                ],
            }).sort({ createdAt: 1 }); // Sort messages by creation time (oldest to newest)

            res.status(200).json({ success: true, messages });
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ success: false, error: "Failed to retrieve messages." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
