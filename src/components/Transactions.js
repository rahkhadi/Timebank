import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Transactions.module.css';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const userId = localStorage.getItem('userId'); // Assume userId is stored after login

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/transactions', {
                    params: { userId },
                });

                setTransactions(response.data.transactions);
            } catch (err) {
                console.error('Error fetching transactions:', err.message);
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
                    {transactions.map((txn) => (
                        <tr key={txn._id}>
                            <td>{txn.sender?.name || 'Unknown'}</td>
                            <td>{txn.receiver?.name || 'Unknown'}</td>
                            <td>{txn.amount}</td>
                            <td>{txn.description || 'N/A'}</td>
                            <td>{new Date(txn.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
