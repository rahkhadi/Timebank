// pages/_app.js
import { useEffect } from "react";
import Router from "next/router";
import "../styles/globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
	return (
		<AuthProvider>
			<SessionTimeoutHandler />
			<Layout>
				<Component {...pageProps} />
			</Layout>

			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</AuthProvider>
	);
}

const SessionTimeoutHandler = () => {
	const { sessionExpired, setSessionExpired } = useAuth();

	useEffect(() => {
		if (sessionExpired) {
			alert("Your session has timed out and you have been automatically logged out.");
			setSessionExpired(false);
			Router.push("/");
		}
	}, [sessionExpired, setSessionExpired]);

	return null;
};

export default MyApp;
