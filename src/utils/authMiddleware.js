// utils/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (handler) => async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		return handler(req, res);
	} catch (err) {
		return res.status(401).json({ error: "Unauthorized" });
	}
};

export default authMiddleware;