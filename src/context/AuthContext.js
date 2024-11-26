// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null); // Store user details
	const [sessionExpired, setSessionExpired] = useState(false);

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			setIsLoggedIn(true);
            setUser({ email: user.email, firstName: user.firstName }); // fetch user data 
		}
	}, []);

	const login = (token, user) => {
		Cookies.set("token", token, { expires: 30 / 1440 }); // 30 minutes
		setIsLoggedIn(true);
		setUser(user); // Set the user details
		setSessionExpired(false);
	};

	const logout = () => {
		Cookies.remove("token");
		Cookies.remove("refreshToken");
		setIsLoggedIn(false);
		setUser(null); // Clear user details
		Router.push("/");
	};

	const refreshAuthToken = async () => {
		try {
			const response = await axios.post("/api/auth/refresh");
			if (response.status === 200) {
				// Refresh token was successful; do nothing further
			}
		} catch (error) {
			console.error("Error refreshing token:", error);
			logout();
		}
	};

	useEffect(() => {
		if (isLoggedIn) {
			const interval = setInterval(refreshAuthToken, 25 * 60 * 1000); // Refresh every 25 minutes for 30-minute token
			return () => clearInterval(interval);
		}
	}, [isLoggedIn]);

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, user, login, logout, sessionExpired, setSessionExpired }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);