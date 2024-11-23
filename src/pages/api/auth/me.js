import jwt from "jsonwebtoken";
import User from "@/utils/userModel";
import connectDB from "@/utils/dbConnect";

connectDB();

export default async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Support both cookies and headers

    if (!token) {
        return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password"); // Exclude password from response
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Token validation error:", error.message);
        return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }
};
