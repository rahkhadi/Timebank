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
                setStatus(data.success); // Show success message from API
                setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
            } else {
                setStatus(data.error || "There was an error sending your message. Please try again.");
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
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Message:
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Send Message</button>
            </form>

            {status && <p className="status-message">{status}</p>}

            <style jsx>{`
                .contact-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    text-align: center;
                }
                .contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .contact-form label {
                    display: flex;
                    flex-direction: column;
                    align-items: start;
                }
                .contact-form input,
                .contact-form textarea {
                    width: 100%;
                    padding: 10px;
                    margin-top: 5px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .contact-form button {
                    padding: 10px 20px;
                    background-color: #0070f3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .contact-form button:hover {
                    background-color: #005bb5;
                }
                .status-message {
                    margin-top: 20px;
                    font-weight: bold;
                    color: green;
                }
            `}</style>
        </div>
    );
};

export default Contact;
