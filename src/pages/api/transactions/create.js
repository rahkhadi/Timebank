import dbConnect from "@/utils/dbConnect";
import Transaction from "@/utils/transactionModel";
import authMiddleware from "@/utils/authMiddleware";

const handler = async (req, res) => {
    await dbConnect();

    if (req.method === "POST") {
        const { senderId, receiverId, amount, description } = req.body;

        // Fix: Validate required fields
        if (!senderId || !receiverId || !amount) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Fix: Validate amount to be a positive number
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Amount must be a positive number" });
        }

        try {
            const transaction = new Transaction({
                sender: senderId,
                receiver: receiverId,
                amount,
                description,
            });

            await transaction.save();

            res.status(201).json({ success: true, transaction });
        } catch (err) {
            console.error("Transaction creation error:", err.message);
            res.status(500).json({ error: "Failed to create transaction" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
};

export default authMiddleware(handler);
