import jwt from "jsonwebtoken";

const authMiddleware = (handler) => async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: decoded.userId, // Attach userId from token
            name: decoded.username || "User", // Optional: Attach username
        };

        return handler(req, res);
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;
