import dbConnect from "@/utils/dbConnect";
import authMiddleware from "@/utils/authMiddleware";
import Notification from "@/utils/notificationModel";

const handler = async (req, res) => {
    await dbConnect();

    if (req.method === "GET") {
        if (!req.user) {
            // Ensure req.user exists after token verification
            return res.status(401).json({ error: "User is not authenticated" });
        }

        try {
            const notifications = await Notification.find({ user: req.user.userId }).sort({
                createdAt: -1,
            });
            res.status(200).json({ success: true, data: notifications });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
};

export default authMiddleware(handler);
