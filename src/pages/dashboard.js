import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Pagination from "@/components/Pagination";
import styles from "../styles/Dashboard.module.css";
import TimeCoins from "@/components/TimeCoins";

const Dashboard = () => {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestsPerPage = 8;

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User is not authenticated");
          return;
        }

        const response = await axios.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      }
    };

    fetchNotifications();
  }, []);

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/requests`, {
          params: { page: currentPage, limit: requestsPerPage },
        });

        setRequests(response.data.requests || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching requests:", error.message);
        if (error.response?.status === 401) router.push("/login");
        else setError("Failed to load requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentPage]);

  // Apply filters and sorting
  const applyFilterAndSort = () => {
    let filteredRequests = [...requests];

    if (selectedFilter === "Open") filteredRequests = filteredRequests.filter((req) => !req.isClosed);
    if (selectedFilter === "Expired") filteredRequests = filteredRequests.filter((req) => req.isExpired);

    if (sortBy === "Newest") filteredRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "Fewest TimeCoins") filteredRequests.sort((a, b) => a.timeCoins - b.timeCoins);
    if (sortBy === "Most TimeCoins") filteredRequests.sort((a, b) => b.timeCoins - a.timeCoins);

    return filteredRequests;
  };

  const handleFilterChange = (e) => setSelectedFilter(e.target.value);
  const handleSortChange = (e) => setSortBy(e.target.value);
  const handlePageChange = (page) => setCurrentPage(page);

  const handleCreateRequestClick = () => router.push("/create-request");

  const handleAcceptRequest = async (requestId) => {
    try {
        const response = await fetch("/api/requests/accept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Pass the token
            },
            body: JSON.stringify({ requestId }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(`Failed to accept the request: ${error.error}`);
            return;
        }

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Error accepting request:", error);
        alert("Failed to accept the request.");
    }
};



  const displayedRequests = applyFilterAndSort();

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1>Dashboard</h1>
        <p>Manage community requests and notifications.</p>
      </div>

    

    

      {/* Filters and Sorting */}
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
      <div>
            <TimeCoins /> {/* Display TimeCoins */}
            <h1>Dashboard</h1>
            {/* Other dashboard content */}
        </div>
      {/* Requests Section */}
      <div className={styles.contentSection}>
        {loading ? (
          <p>Loading requests...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : displayedRequests.length > 0 ? (
          displayedRequests.map((request) => (
            <div key={request._id} className={styles.card}>
              <h3>{request.title}</h3>
              <p>{request.description}</p>
              <p>
                <strong>TimeCoins:</strong> {request.timeCoins}
              </p>
              <p>
    <strong>Created By:</strong> {`${request.createdBy?.firstName} ${request.createdBy?.lastName}` || "Unknown"}
</p>

              {request.imageUrl && (
                <img src={request.imageUrl} alt={request.title} className={styles.requestImage} />
              )}
              <button className={styles.acceptButton} onClick={() => handleAcceptRequest(request._id)}>
                Accept
              </button>
            </div>
          ))
        ) : (
          <p>No requests found.</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Dashboard;
