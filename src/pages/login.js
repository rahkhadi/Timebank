// pages/login.js
import Head from 'next/head';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

const Login = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const router = useRouter();
	const { login } = useAuth(); // Access the login function from AuthContext

	const handleInputChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		});
	};
	console.log("JWT_SECRET:", process.env.JWT_SECRET);


	const handleLogin = async (event) => {
		event.preventDefault(); // Prevent the default form submission
		setError(""); // Clear any previous errors
	
		try {
			const response = await axios.post("/api/auth/login", formData);
			if (response.data.success) {
				// Pass the token and user data to the login function
				login(response.data.token, response.data.data);
				router.push("/dashboard"); // Redirect to a protected route
			}
		} catch (err) {
			if (!err.response) {
				setError("Network error. Please check your connection.");
			} else {
				setError(err.response?.data?.error || "An unexpected error occurred");
			}
		}
	};
	
	return (
		<>
  <Head>
        <title>Timebank - Login</title>
        <meta name="description" content="Login to Timebank." />
      </Head>
		<div className="max-w-md mx-auto mt-16 p-8 border border-gray-300 rounded-lg bg-white shadow-md">
			<h1 className="text-3xl font-bold text-center mb-6">Login</h1>
			{error && <p className="text-red-500 text-center mb-4">{error}</p>}
			<form onSubmit={handleLogin} className="space-y-4">
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
						value={formData.password}
						onChange={handleInputChange}
						required
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]"
						style={{ color: '#001F3F' }}
					/>
				</div>
				<button
					type="submit"
					className="btn-submit w-full py-2 px-4 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-[#1f2937] focus:border-[#1f2937]">
					Login
				</button>
				<Link href="/signup">
					<p className="w-full mt-3 text-center text-gray-500">
						Don’t have an account?{" "}
						<span className="underline-decoration font-medium cursor-pointer hover:text-[#1f2937]">
							Sign up here
						</span>
					</p>
				</Link>
			</form>
		</div>
		</>
	);
};

export default Login;