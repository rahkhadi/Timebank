import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Transactions.module.css";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [userId, setUserId] = useState(null); // Fix: State for `userId`

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("userId"); // Access localStorage only on the client side
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!userId) return;

            try {
                const response = await axios.get("/api/transactions", {
                    params: { userId },
                });

                setTransactions(response.data.transactions || []);
            } catch (err) {
                console.error("Error fetching transactions:", err.message);
            }
        };

        fetchTransactions();
    }, [userId]);

    return (
        <div className={styles.transactionsContainer}>
            <h1>Transaction History</h1>
            <table className={styles.transactionTable}>
                <thead>
                    <tr>
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((txn) => (
                            <tr key={txn._id}>
                                <td>{txn.sender?.name || "Unknown"}</td>
                                <td>{txn.receiver?.name || "Unknown"}</td>
                                <td>{txn.amount}</td>
                                <td>{txn.description || "N/A"}</td>
                                <td>{new Date(txn.createdAt).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No transactions found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
