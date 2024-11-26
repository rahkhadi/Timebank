import connectDB from "@/utils/dbConnect";
import ContactMessage from "@/utils/contactMessageModel";
import nodemailer from "nodemailer";

connectDB();

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        try {
            // Save the message to the database
            await ContactMessage.create({ name, email, phone, message });

            // Set up Nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // Send email notification
            await transporter.sendMail({
                from: email,
                to: "rahim.aziz555@gmail.com",
                subject: "New Contact Form Submission",
                text: `Message from: ${name} <${email}> (Phone: ${phone})\n\n${message}`,
            });

            // Respond with success
            res.status(200).json({ success: "Your message has been sent successfully!" });
        } catch (error) {
            console.error("Error handling contact form:", error);
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
