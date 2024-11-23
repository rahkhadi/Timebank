import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    // Check token and fetch user data on initial load
    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            axios
                .get("/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setUser(response.data.user);
                    setIsLoggedIn(true);
                })
                .catch(() => {
                    Cookies.remove("token");
                    setIsLoggedIn(false);
                });
        }
    }, []);

    const login = (token, user) => {
        if (token && user) {
            Cookies.set("token", token, { expires: 0.5 }); // 30 minutes expiry
            setIsLoggedIn(true);
            setUser(user);
        } else {
            console.error("Invalid token or user data during login");
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setIsLoggedIn(false);
        setUser(null);
        Router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
