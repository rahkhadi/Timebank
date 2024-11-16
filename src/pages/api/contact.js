// pages/api/contact.js
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (req, res) => {
	if (req.method === "POST") {
		const { name, email, phone, reason, message } = req.body;

		// Prepare the email content
		const mailOptions = {
			to: "rahimkhaadimhussain219@gmail.com",
			from: "rahimkhadimhussain219@gmail.com",
			subject: "New Message from Contact Form",
			html: `
          <h1>${reason}</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
		};

		try {
			// Send the email
			await sendgrid.send(mailOptions);
			res.status(200).json({ message: "Message sent successfully" });
		} catch (error) {
			console.error("Error sending email:", error);
			res.status(500).json({ message: "Error sending message" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
};

export default sendEmail;
