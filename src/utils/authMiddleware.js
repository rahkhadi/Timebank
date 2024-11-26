import jwt from "jsonwebtoken";

const authMiddleware = (handler) => async (req, res) => {
	const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

	if (!token) {
		return res.status(401).json({ error: "Unauthorized: No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // Attach decoded token to the request
		return handler(req, res);
	} catch (err) {
		console.error("Token verification error:", err);
		return res.status(401).json({ error: "Invalid or expired token" });
	}
};

export default authMiddleware;
