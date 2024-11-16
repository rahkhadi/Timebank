import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// import Navbar from '../components/NavBar.js'; // Assuming Navbar contains the search bar
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const { isLoggedIn } = useAuth();
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');

    const fetchRequests = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token found");

            const response = await axios.get('/api/requests', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(response.data);
            setFilteredRequests(response.data); // Initialize filtered requests
        } catch (error) {
            if (error.response?.status === 401) {
                router.push('/login');
            } else {
                console.error("Error fetching requests:", error.message);
            }
        }
    }, [router]);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        } else {
            fetchRequests();
        }
    }, [isLoggedIn, fetchRequests, router]);

    // Filter requests based on selected filter
    useEffect(() => {
        let updatedRequests = [...requests];

        if (selectedFilter === 'Open') {
            updatedRequests = updatedRequests.filter(req => !req.isClosed);
        } else if (selectedFilter === 'Expired') {
            updatedRequests = updatedRequests.filter(req => req.isExpired);
        }

        // Sort requests
        if (sortBy === 'Newest') {
            updatedRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'Fewest TimeCoins') {
            updatedRequests.sort((a, b) => a.timeCoins - b.timeCoins);
        } else if (sortBy === 'Most TimeCoins') {
            updatedRequests.sort((a, b) => b.timeCoins - a.timeCoins);
        }

        setFilteredRequests(updatedRequests);
    }, [selectedFilter, sortBy, requests]);

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleCreateRequestClick = () => {
        router.push('/create-request');
    };

    return (
        <div className={styles.dashboardContainer}>
         

            <div className={styles.dashboardHeader}>
                <h1>Help someone</h1>
                <p>Explore community requests to find ways to assist.</p>
            </div>

            <div className={styles.dashboardActions}>
                <button
                    className={styles.createRequestButton}
                    onClick={handleCreateRequestClick}
                >
                    + Create Request
                </button>
            </div>

            <div className={styles.filters}>
                <div className={styles.filter}>
                    <label htmlFor="filter">Filter by</label>
                    <select id="filter" value={selectedFilter} onChange={handleFilterChange}>
                        <option value="All">All</option>
                        <option value="Open">Open</option>
                        <option value="Expired">Expired</option>
                    </select>
                </div>
                <div className={styles.filter}>
                    <label htmlFor="sort">Sort by</label>
                    <select id="sort" value={sortBy} onChange={handleSortChange}>
                        <option value="Newest">Newest</option>
                        <option value="Fewest TimeCoins">Fewest TimeCoins</option>
                        <option value="Most TimeCoins">Most TimeCoins</option>
                    </select>
                </div>
            </div>

            <div className="content-section">
                <h2>Available Requests</h2>
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request._id} className="card">
                            <h3>{request.title}</h3>
                            <p>{request.description}</p>
                            <p><strong>TimeCoins:</strong> {request.timeCoins}</p>
                        </div>
                    ))
                ) : (
                    <p>No requests found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
