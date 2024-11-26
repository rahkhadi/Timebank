// src/components/TimeCoins.js
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/TimeCoins.module.css";

export default function TimeCoins() {
    const [timeCoins, setTimeCoins] = useState(0);

    useEffect(() => {
        const fetchTimeCoins = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("/api/users/timecoins", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTimeCoins(response.data.timeCoins);
            } catch (error) {
                console.error("Error fetching TimeCoins:", error.message);
            }
        };

        fetchTimeCoins();
    }, []);

    return (
        <div className={styles.timeCoinsContainer}>
            <span>TimeCoins: {timeCoins}</span>
        </div>
    );
}
