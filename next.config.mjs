// ./next.config.mjs
import dotenv from "dotenv";
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		unoptimized: true,
	},
	env: {
		MONGODB_URI: process.env.MONGODB_URI,
		JWT_SECRET: process.env.JWT_SECRET,
		JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
		SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
		TMDB_API_KEY: process.env.TMDB_API_KEY, // Add this line for API key
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "image.tmdb.org",
				pathname: "/t/p/**",
			},
		],
	},
};

export default nextConfig;
