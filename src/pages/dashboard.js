import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Pagination from '@/components/Pagination'; // Import the Pagination component
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [totalPages, setTotalPages] = useState(1); // Total pages state
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const requestsPerPage = 6; // Number of requests per page

    // Fetch requests from the backend
    const fetchRequests = async () => {
        try {
            const response = await axios.get(`/api/requests?page=${currentPage}&limit=${requestsPerPage}`);
            setRequests(response.data.requests);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching requests:', error.message);
            if (error.response?.status === 401) {
                router.push('/login');
            }
        }
    };

    useEffect(() => {
        fetchRequests(); // Fetch all requests on component mount or page change
    }, [currentPage]);

    const applyFilterAndSort = () => {
        let filteredRequests = [...requests];

        // Apply filter
        if (selectedFilter === 'Open') {
            filteredRequests = filteredRequests.filter((req) => !req.isClosed);
        } else if (selectedFilter === 'Expired') {
            filteredRequests = filteredRequests.filter((req) => req.isExpired);
        }

        // Apply sorting
        if (sortBy === 'Newest') {
            filteredRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'Fewest TimeCoins') {
            filteredRequests.sort((a, b) => a.timeCoins - b.timeCoins);
        } else if (sortBy === 'Most TimeCoins') {
            filteredRequests.sort((a, b) => b.timeCoins - a.timeCoins);
        }

        return filteredRequests;
    };

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
        setCurrentPage(1); // Reset to the first page on filter change
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1); // Reset to the first page on sort change
    };

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update current page
    };

    const handleCreateRequestClick = () => {
        router.push('/create-request');
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.post(
                '/api/requests/accept',
                { requestId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the header
                    },
                }
            );

            if (response.data.success) {
                alert('Request accepted successfully!');
                fetchRequests(); // Refresh the requests after accepting one
            }
        } catch (error) {
            console.error('Error accepting request:', error.message);
            alert('Failed to accept the request. Please try again.');
        }
    };

    const displayedRequests = applyFilterAndSort();

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardHeader}>
                <h1>Help Someone</h1>
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

            <div className={styles.contentSection}>
                <h2>Available Requests</h2>
                {displayedRequests.length > 0 ? (
                    displayedRequests.map((request) => (
                        <div key={request._id} className={styles.card}>
                            <h3>{request.title}</h3>
                            <p>{request.description}</p>
                            <p>
                                <strong>TimeCoins:</strong> {request.timeCoins}
                            </p>
                            <p>
                                <strong>Created By:</strong>{' '}
                                {request.creator
                                    ? `${request.creator.firstName} ${request.creator.lastName}`
                                    : 'Unknown'}
                            </p>
                            {request.imageUrl && (
                                <img
                                    src={request.imageUrl}
                                    alt={request.title}
                                    className={styles.requestImage}
                                />
                            )}

                            <button
                                className={styles.acceptButton}
                                onClick={() => handleAcceptRequest(request._id)}
                            >
                                Accept
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No requests found.</p>
                )}

                {/* Pagination Component */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default Dashboard;
