// src/pages/api/auth/signup.js
import dbConnect from "@/utils/dbConnect";
import User from "@/utils/userModel";
import bcrypt from "bcrypt";

dbConnect();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { firstName, lastName, username, email, password } = req.body;

        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        try {
            // Check if email or username already exists
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(400).json({ error: "Email or Username already exists." });
            }

            // Hash the password

            // Create a new user with default TimeCoins
            const newUser = new User({
                firstName,
                lastName,
                username,
                email,
                password,
                timeCoins: 3, // Assign 3 TimeCoins by default
            });

            await newUser.save(); // Wait for user to save to the database

            return res.status(201).json({ success: true, message: "User registered successfully!" });
        } catch (error) {
            console.error("Signup error:", error);
            return res.status(500).json({ error: "Failed to register user. Please try again." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed." });
    }
}
