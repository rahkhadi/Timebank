import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Pagination from "@/components/Pagination";
import styles from "../styles/Dashboard.module.css";

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
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        "/api/requests/accept",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Request accepted successfully!");
        setRequests((prev) => prev.filter((req) => req._id !== requestId)); // Remove accepted request
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error("Error accepting request:", error.message);
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

      {/* Notifications Section */}
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

      {/* Actions Section */}
      <div className={styles.dashboardActions}>
        <button className={styles.createRequestButton} onClick={handleCreateRequestClick}>
          + Create Request
        </button>
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
                <strong>Created By:</strong>{" "}
                {request.creator ? `${request.creator.firstName} ${request.creator.lastName}` : "Unknown"}
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
