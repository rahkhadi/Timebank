// pages/api/auth/signup.js
import connectDB from "@/utils/dbConnect";
import User from "@/utils/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

connectDB();

export default async (req, res) => {
	const { method } = req;

	if (method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).end(`Method ${method} Not Allowed`);
	}

	try {
		const { firstName, lastName, email, password } = req.body;
		console.log("Sign up request received:", { firstName, lastName, email });

		// Check if the user already exists
		const userExists = await User.findOne({ email: email.toLowerCase() });
		if (userExists) {
			return res.status(400).json({ success: false, error: "User already exists" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const user = await User.create({
			firstName,
			lastName,
			email: email.toLowerCase(),
			password: hashedPassword,
		});

		// Generate JWT token for the user
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

		// Return the user data
		res.status(201).json({
			success: true,
			data: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		});
	} catch (error) {
		console.error("Sign up error:", error);
		res.status(500).json({ success: false, error: "An unexpected error occurred" });
	}
};
