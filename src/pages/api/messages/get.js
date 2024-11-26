import dbConnect from "@/utils/dbConnect";
import Message from "@/utils/messageModel";
import mongoose from "mongoose";

dbConnect();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { user1, user2 } = req.query;

        if (!mongoose.Types.ObjectId.isValid(user1) || !mongoose.Types.ObjectId.isValid(user2)) {
            return res.status(400).json({ success: false, error: "Invalid user IDs." });
        }

        try {
            const messages = await Message.find({
                $or: [
                    { sender: user1, receiver: user2 },
                    { sender: user2, receiver: user1 },
                ],
            }).sort({ createdAt: 1 });

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
