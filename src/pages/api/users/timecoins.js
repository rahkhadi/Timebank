// src/pages/api/users/timecoins.js
import dbConnect from "@/utils/dbConnect";
import User from "@/utils/userModel";
import authMiddleware from "@/utils/authMiddleware";

dbConnect();

async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const user = await User.findById(req.user.userId); // User ID from JWT middleware
            if (!user) return res.status(404).json({ error: "User not found" });

            res.status(200).json({ timeCoins: user.timeCoins });
        } catch (error) {
            console.error("Error fetching TimeCoins:", error.message);
            res.status(500).json({ error: "Internal server error." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}

export default authMiddleware(handler);
