import jwt from 'jsonwebtoken';

export default function authMiddleware(handler) {
    return async (req, res) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach user data to the request
            return handler(req, res);
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
}
