import connectDB from "@/utils/dbConnect";
import User from "@/utils/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookie from "cookie";

connectDB();

export default async (req, res) => {
    const { method } = req;

    if (method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
    }

    try {
        const { firstName, lastName, email, password, username } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !username) {
            return res.status(400).json({ success: false, error: "All fields are required." });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ success: false, error: "User with this email already exists." });
        }

        // Hash the password for security

        // Create a new user
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            username,
            password, // Save the hashed password
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

        // Set the token in an HTTP-only cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                maxAge: 600, // 10 minutes
                sameSite: "strict",
                path: "/",
            })
        );

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, error: "An unexpected error occurred." });
    }
};
