import dotenv from "dotenv";
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enables React's Strict Mode to catch potential issues in React components
    reactStrictMode: true,

    // Runtime environment variables
    env: {
        MONGODB_URI: process.env.MONGODB_URI, // MongoDB connection URI
        JWT_SECRET: process.env.JWT_SECRET, // JWT secret for token signing
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET, // Refresh token secret
        SESSION_SECRET: process.env.SESSION_SECRET, // Session secret
        EMAIL_USER: process.env.EMAIL_USER, // Email service user
        EMAIL_PASS: process.env.EMAIL_PASS, // Email service password
    },
};

export default nextConfig;
