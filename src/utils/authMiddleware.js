import jwt from 'jsonwebtoken';

export default function authMiddleware(handler) {
    return async (req, res) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1] // Extract token from "Bearer <token>"
            : req.cookies.token; // Fallback to cookies

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach decoded user data to the request
            return handler(req, res);
        } catch (err) {
            console.error('Token validation error:', err.message);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
}
