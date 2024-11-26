import { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation for phone number
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(formData.phone)) {
            setStatus("Please enter a valid phone number.");
            return;
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("Message sent successfully!");
                setFormData({ name: "", email: "", phone: "", message: "" });
            } else {
                setStatus(data.error || "There was an error sending your message.");
            }
        } catch (error) {
            console.error("Error submitting contact form:", error);
            setStatus("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <p>Have a question or feedback? We'd love to hear from you!</p>

            <form onSubmit={handleSubmit} className="contact-form">
                <label htmlFor="name">
                    Name:
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label htmlFor="email">
                    Email:
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label htmlFor="phone">
                    Phone:
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label htmlFor="message">
                    Message:
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Send Message</button>
            </form>

            {status && (
                <p
                    className={`status-message ${
                        status.includes("successfully") ? "text-green-500" : "text-red-500"
                    }`}
                >
                    {status}
                </p>
            )}

            <style jsx>{`
                .status-message.text-green-500 {
                    color: green;
                }
                .status-message.text-red-500 {
                    color: red;
                }
            `}</style>
        </div>
    );
};

export default Contact;
