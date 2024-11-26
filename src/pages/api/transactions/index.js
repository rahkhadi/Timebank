import dbConnect from "@/utils/dbConnect";
import Transaction from "@/utils/transactionModel";
import authMiddleware from "@/utils/authMiddleware";

const handler = async (req, res) => {
    await dbConnect();

    if (req.method === "GET") {
        const { userId } = req.query;

        // Fix: Validate userId
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        try {
            const transactions = await Transaction.find({
                $or: [{ sender: userId }, { receiver: userId }],
            })
                .populate("sender", "name email")
                .populate("receiver", "name email")
                .sort({ createdAt: -1 });

            res.status(200).json({ transactions });
        } catch (err) {
            console.error("Error fetching transactions:", err.message);
            res.status(500).json({ error: "Failed to fetch transactions" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
};

export default authMiddleware(handler);
