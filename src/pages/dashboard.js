import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Pagination from '@/components/Pagination'; // Import the Pagination component
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const requestsPerPage = 8;
    const [notifications, setNotifications] = useState([]);
    const token = "your-auth-token"; // Replace with actual token logic

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/notifications', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) setNotifications(data.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []); 

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`/api/requests?page=${currentPage}&limit=${requestsPerPage}`);
                setRequests(response.data.requests);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching requests:', error.message);
                if (error.response?.status === 401) router.push('/login');
            }
        };

        fetchRequests();
    }, [currentPage]);

    const applyFilterAndSort = () => {
        let filteredRequests = [...requests];

        if (selectedFilter === 'Open') filteredRequests = filteredRequests.filter((req) => !req.isClosed);
        if (selectedFilter === 'Expired') filteredRequests = filteredRequests.filter((req) => req.isExpired);

        if (sortBy === 'Newest') filteredRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sortBy === 'Fewest TimeCoins') filteredRequests.sort((a, b) => a.timeCoins - b.timeCoins);
        if (sortBy === 'Most TimeCoins') filteredRequests.sort((a, b) => b.timeCoins - a.timeCoins);

        return filteredRequests;
    };

    const handleFilterChange = (e) => setSelectedFilter(e.target.value);
    const handleSortChange = (e) => setSortBy(e.target.value);
    const handlePageChange = (page) => setCurrentPage(page);

    const handleCreateRequestClick = () => router.push('/create-request');
    const handleAcceptRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(
                '/api/requests/accept',
                { requestId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) alert('Request accepted successfully!');
        } catch (error) {
            console.error('Error accepting request:', error.message);
            alert('Failed to accept the request.');
        }
    };

    const displayedRequests = applyFilterAndSort();

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardHeader}>
               
                <p>Manage community requests and notifications.</p>
            </div>

            <div className={styles.notificationsSection}>
                <h2>Notifications</h2>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div key={notification._id} className={styles.notification}>
                            <p>{notification.message}</p>
                        </div>
                    ))
                ) : (
                    <p>No notifications available.</p>
                )}
            </div>

            <div className={styles.dashboardActions}>
                <button className={styles.createRequestButton} onClick={handleCreateRequestClick}>
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

            <div className={styles.contentSection}>
                {displayedRequests.length > 0 ? (
                    displayedRequests.map((request) => (
                        <div key={request._id} className={styles.card}>
                            <h3>{request.title}</h3>
                            <p>{request.description}</p>
                            <p>
                                <strong>TimeCoins:</strong> {request.timeCoins}
                            </p>
                            <p>
                                <strong>Created By:</strong> {request.creator ? `${request.creator.firstName} ${request.creator.lastName}` : 'Unknown'}
                            </p>
                            {request.imageUrl && <img src={request.imageUrl} alt={request.title} className={styles.requestImage} />}
                            <button className={styles.acceptButton} onClick={() => handleAcceptRequest(request._id)}>
                                Accept
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No requests found.</p>
                )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
};

export default Dashboard;
