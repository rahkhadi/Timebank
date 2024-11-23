import jwt from 'jsonwebtoken';

const authMiddleware = (handler) => async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated. Token is missing.' });
    }

    try {
        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log decoded user (AFTER initialization)
        console.log("Decoded user:", decoded);

        // Attach the user ID to the request
        req.user = { userId: decoded.userId };

        // Proceed to the handler
        return handler(req, res);
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export default authMiddleware;
