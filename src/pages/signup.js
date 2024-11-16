// pages/signup.js
import Head from 'next/head';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

const Signup = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const router = useRouter();

	const { firstName, lastName, email, password } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const res = await axios.post("/api/auth/signup", formData);
			console.log(res.data);
			// Handle successful signup
			router.push("/login");
		} catch (err) {
			console.error("Signup error:", err.response?.data);
			setError(err.response?.data?.error || "An unexpected error occurred");
		}
	};

	return (
		<>
  <Head>
        <title>Timebank - Sign Up</title>
        <meta name="description" content="Sign up to Timebank." />
      </Head>
		<div className="max-w-md mx-auto mt-16 p-8 border border-gray-300 rounded-lg bg-white shadow-md">
			<h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
			{error && <p className="text-red-500 text-center mb-4">{error}</p>}
			<form onSubmit={onSubmit} className="space-y-4">
				<div>
					<label htmlFor="firstName" className="block text-sm font-medium">
						First Name:
					</label>
					<input
						type="text"
						id="firstName"
						name="firstName"
						value={firstName}
						onChange={onChange}
						required
						className="form-color mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]"
						style={{ color: '#001F3F' }}
					/>
				</div>
				<div>
					<label htmlFor="lastName" className="block text-sm font-medium">
						Last Name:
					</label>
					<input
						type="text"
						id="lastName"
						name="lastName"
						value={lastName}
						onChange={onChange}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]"
						style={{ color: '#001F3F' }}
					/>
				</div>
				<div>
					<label htmlFor="email" className="block text-sm font-medium">
						Email:
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={onChange}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]"
						style={{ color: '#001F3F' }}
					/>
				</div>
				<div>
					<label htmlFor="password" className="block text-sm font-medium">
						Password:
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={onChange}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]"
						style={{ color: '#001F3F' }}
					/>
				</div>
				<button
					type="submit"
					className="btn-submit w-full py-2 px-4 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]">
					Sign Up
				</button>
			</form>

			<Link href="/login">
				<p className="w-full mt-3 text-center text-gray-500">
					Already have a Timebank account?&nbsp;
					<span className="underline-decoration font-medium cursor-pointer hover:text-[#1f2937]">Login</span>
				</p>
			</Link>
		</div>
		</>
	);
};

export default Signup;
