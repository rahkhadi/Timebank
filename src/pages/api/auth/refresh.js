import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async (req, res) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
    }

    try {
        // Parse cookies from the request
        const cookies = cookie.parse(req.headers.cookie || "");
        const refreshToken = cookies.refreshToken;

        // Check if the refresh token is present
        if (!refreshToken) {
            return res.status(401).json({ success: false, error: "No refresh token provided" });
        }

        // Verify the refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                console.error("Refresh token verification failed:", err.message);
                return res.status(403).json({ success: false, error: "Invalid or expired refresh token" });
            }

            // Decode the refresh token and extract the userId
            const userId = decoded.userId;

            if (!userId) {
                return res.status(403).json({ success: false, error: "Invalid refresh token payload" });
            }

            // Generate a new access token
            const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
                expiresIn: "30m", // 30 minutes
            });

            // Update the token in cookies
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 1800, // 30 minutes
                    sameSite: "strict",
                    path: "/",
                })
            );

            // Send a success response with the new token
            res.status(200).json({
                success: true,
                token: newAccessToken,
                message: "Token refreshed successfully",
            });
        });
    } catch (error) {
        console.error("Unexpected error during refresh:", error.message);
        res.status(500).json({ success: false, error: "An unexpected error occurred" });
    }
};
