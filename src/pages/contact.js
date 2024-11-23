import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Router from "next/router";

const ContactPage = () => {
    const { isLoggedIn, user } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        reason: "",
        message: "",
    });

    // Prefill email when user data is available
    useEffect(() => {
        if (user && user.email) {
            setFormData((prev) => ({ ...prev, email: user.email }));
        }
    }, [user]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoggedIn) {
            Router.push("/login");
        }
    }, [isLoggedIn]);

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("/api/contact", formData);

            if (response.status === 200) {
                toast.success("Message sent successfully!");
                setFormData({
                    name: "",
                    email: user.email || "",
                    phone: "",
                    reason: "",
                    message: "",
                });
            } else {
                toast.error("Error sending message.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send the message.");
        }
    };

    if (!isLoggedIn) {
        return <p>Redirecting to login...</p>; // Simple fallback while redirecting
    }

    return (
        <div className="form-color max-w-md mx-auto mt-16 p-6 border border-gray-300 rounded-lg bg-white shadow-md">
            <Head>
                <title>Contact Us</title>
            </Head>
            <h1 className="text-2xl font-bold text-center mb-6">Contact Us</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium">
                        Phone:
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]"
                    />
                </div>
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium">
                        Reason for Contacting:
                    </label>
                    <input
                        type="text"
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium">
                        Message:
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937] h-28 resize-none"
                    />
                </div>
                <button
                    type="submit"
                    className="btn-submit w-full py-2 px-4 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-[#1f2937]"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ContactPage;
