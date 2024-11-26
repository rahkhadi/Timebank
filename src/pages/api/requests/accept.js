// src/pages/api/requests/accept.js
import dbConnect from "@/utils/dbConnect";
import User from "@/utils/userModel";
import Request from "@/utils/requestModels";
import authMiddleware from "@/utils/authMiddleware";

dbConnect();

async function handler(req, res) {
    if (req.method === "POST") {
        const { requestId } = req.body;

        try {
            const user = await User.findById(req.user.userId);
            if (!user) return res.status(404).json({ error: "User not found" });

            const request = await Request.findById(requestId);
            if (!request) return res.status(404).json({ error: "Request not found" });

            // Check if the user has enough TimeCoins
            if (user.timeCoins < request.timeCoinsRequired) {
                return res.status(400).json({ error: "Not enough TimeCoins to accept this request." });
            }

            // Deduct TimeCoins and mark the request as accepted
            user.timeCoins -= request.timeCoinsRequired;
            await user.save();

            request.status = "Accepted";
            request.acceptedBy = user._id;
            await request.save();

            res.status(200).json({ success: true, message: "Request accepted successfully!" });
        } catch (error) {
            console.error("Error accepting request:", error.message);
            res.status(500).json({ error: "Failed to accept the request." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}

export default authMiddleware(handler);
