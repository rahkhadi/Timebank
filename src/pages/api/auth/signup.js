import connectDB from "@/utils/dbConnect";
import User from "@/utils/userModel";
import jwt from "jsonwebtoken";
import cookie from "cookie";

connectDB();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { firstName, lastName, username, email, password } = req.body;

        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "Email or username already in use." });
        }

        const user = await User.create({
            firstName,
            lastName,
            username,
            email: email.toLowerCase(),
            password,
        });

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                maxAge: 24 * 60 * 60, // 1 day
                path: "/",
            })
        );

        res.status(201).json({ success: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
}
