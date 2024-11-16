// pages/contact.js
import Head from 'next/head';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";

const ContactPage = () => {
	const { isLoggedIn, user } = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		email: "", // Initialize email from Auth Context
		phone: "",
		reason: "",
		message: "",
	});
	const [status, setStatus] = useState("");

	useEffect(() => {
		if (user && user.email) {
			setFormData((prev) => ({ ...prev, email: user.email })); // Prefill email
		}
	}, [user]);

	if (!isLoggedIn) {
		return (
			<>
  <Head>
        <title>TimeBank - Contact Us</title>
        <meta name="description" content="Contact PopcornBuddy's Team." />
      </Head>
			<div className="flex flex-col mt-16 items-center justify-center">
				<div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
					<h2 className="text-3xl font-bold mb-8 text-gray-800">Contact Us</h2>
					<p className="main-color mb-6">
						You need to be logged in to contact us. Please log in to access the contact
						form.
					</p>
					<Link href="/login">
						<button className="btn-submit w-full py-2 px-4 font-semibold rounded-md shadow-md focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]">
							Login
						</button>
					</Link>
					<Link href="/signup">
						<p className="mt-4 text-gray-500">
							Don’t have an account?{" "}
							<span className="underline-decoration font-medium cursor-pointer hover:text-[#1f2937]">
								Sign up here
							</span>
						</p>
					</Link>
				</div>
			</div>
			</>
		);
	}

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
				setStatus("Message sent successfully!");
				setFormData({
					name: "",
					email: formData.email || "",
					phone: "",
					reason: "",
					message: "",
				});
                toast.success(`Message sent successfully!`, {
					position: "bottom-right",
				});
			} else {
				setStatus("Error sending message.");
			}
		} catch (error) {
            toast.error("Failed to update favorites");
			setStatus("Error sending message: " + error.message);
			console.error("Error sending message:", error); // Log error for debugging
		}
	};

	return (
		<div className="form-color max-w-md mx-auto mt-16 p-6 border border-gray-300 rounded-lg bg-white shadow-md">
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
						onChange={handleInputChange}
						required
						disabled
						readOnly
						className="mt-1 block w-full px-3 py-2 border border-gray-300 text-[#136cb2] rounded-md shadow-sm cursor-not-allowed focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none focus:ring-[#1f2937] focus:border-[#1f2937]"
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
					className="btn-submit w-full py-2 px-4 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:border-[#1f2937]">
					Send
				</button>
			</form>
		</div>
	);
};

export default ContactPage;
