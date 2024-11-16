import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FaHeart, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "../../styles/RequestDetails.module.css";
import LoginPrompt from "../../components/LoginPrompt";
import { useAuth } from "../../context/AuthContext"; // Import useAuth from your AuthContext

const RequestDetails = () => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewContent, setReviewContent] = useState("");

    const { isLoggedIn, user } = useAuth(); // Use the custom AuthContext to check if the user is logged in
    const [request, setRequest] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) return;

        const fetchRequestDetails = async () => {
            try {
                const response = await axios.get(`/api/requests/${id}`);
                setRequest(response.data);
            } catch (error) {
                setError("Failed to fetch request details");
                console.error("Error fetching request details:", error);
            }
        };

        fetchRequestDetails();
    }, [id]);

    useEffect(() => {
        const checkUserStatus = async () => {
            if (isLoggedIn && user && request) {
                try {
                    const response = await axios.get(`/api/user/checkRequestStatus`, {
                        params: {
                            userId: user.id,
                            requestId: request._id,
                        },
                    });
                    setIsFavorite(response.data.isFavorite);
                } catch (error) {
                    console.error(
                        "Error checking statuses:",
                        error.response?.data || error.message
                    );
                }
            } else {
                // Reset states when the user is not logged in
                setIsFavorite(false);
            }
        };

        checkUserStatus();
    }, [user, request, isLoggedIn]);

    const handleAddToFavorites = async () => {
        if (!isLoggedIn) {
            setShowLoginPrompt(true); // Show login prompt if not logged in
            return;
        }

        const action = isFavorite ? "removeFavorite" : "addFavorite";

        const dataToSend = {
            userId: user?.id,
            requestId: request._id,
            title: request.title,
        };

        try {
            const response = await axios.post("/api/user/toggleFavorites", dataToSend);
            if (response.data.success) {
                setIsFavorite(!isFavorite);
                toast.success(`Request ${isFavorite ? "removed from" : "added to"} Favorites!`, {
                    position: "bottom-right",
                });
            }
        } catch (error) {
            toast.error("Failed to update favorites");
            console.error("Failed to update favorites:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        const fetchReviews = async () => {
            if (isLoggedIn && user && request) {
                try {
                    const response = await axios.get(`/api/user/getReviews`, {
                        params: {
                            userId: user.id,
                            requestId: request._id,
                        },
                    });
                    setReviews(response.data.reviews);
                } catch (error) {
                    console.error("Error fetching reviews:", error.response?.data || error.message);
                }
            }
        };

        fetchReviews();
    }, [user, request, isLoggedIn]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            setShowLoginPrompt(true);
            return;
        }

        try {
            const response = await axios.post("/api/user/submitReview", {
                userId: user.id,
                requestId: request._id,
                content: reviewContent,
            });

            if (response.data.success) {
                toast.success("Review submitted successfully!", {
                    position: "bottom-right",
                });
                setReviewContent("");
                // Refresh reviews
                const updatedReviews = await axios.get(`/api/user/getReviews`, {
                    params: {
                        userId: user.id,
                        requestId: request._id,
                    },
                });
                setReviews(updatedReviews.data.reviews);
            }
        } catch (error) {
            toast.error("Failed to submit review");
            console.error("Failed to submit review:", error.response?.data || error.message);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!isLoggedIn || !user) {
            setShowLoginPrompt(true);
            return;
        }

        try {
            const response = await axios.delete("/api/user/deleteReview", {
                data: { userId: user.id, reviewId },
            });

            if (response.data.success) {
                toast.success("Review deleted successfully!", {
                    position: "bottom-right",
                });
                // Update the reviews state to remove the deleted review
                setReviews(reviews.filter((review) => review._id !== reviewId));
            }
        } catch (error) {
            toast.error("Failed to delete review");
            console.error("Failed to delete review:", error.response?.data || error.message);
        }
    };

    if (error) {
        return <p className="mt-16 text-red-500 text-center">{error}</p>;
    }

    if (!request) {
        return <p className="main-color mt-16 text-center">Loading...</p>;
    }

    return (
        <>
            <Head>
                <title>TimeBank - Request Details</title>
                <meta
                    name="description"
                    content="Request details and user interactions in TimeBank."
                />
            </Head>
            <div className="container mx-auto p-4 mt-16">
                {showLoginPrompt && <LoginPrompt onClose={() => setShowLoginPrompt(false)} />}
                <div className="flex flex-col md:flex-row">
                    <div className={`${styles.requestInfoSection} main-color md:w-full`}>
                        <div className="flex justify-start items-center">
                            <h1 className="inline text-4xl font-bold">{request.title}</h1>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToFavorites();
                                }}
                                className={`inline ml-10 rounded-full hover:text-red-400 ${
                                    isFavorite ? "text-red-500" : "text-gray-500"
                                }`}>
                                <FaHeart size={36} />
                            </button>
                        </div>
                        <p className="mt-3 text-lg">{request.description}</p>
                        <p className="mt-3">
                            <strong>TimeCoins:</strong> {request.timeCoins}
                        </p>

                        <div className="container mx-auto mt-8">
                            <p className="main-color text-3xl font-semibold">Leave a Review</p>
                            <div className="relative">
                                <form onSubmit={handleReviewSubmit}>
                                    <textarea
                                        className="w-full p-4 mt-4 border rounded resize-none"
                                        rows="4"
                                        value={reviewContent}
                                        onChange={(e) => setReviewContent(e.target.value)}
                                        placeholder="Write your review here..."></textarea>
                                    <button
                                        type="submit"
                                        className="absolute right-4 bottom-4 px-4 py-2 bg-[#1f2937] text-white rounded hover:bg-[#136cb2]">
                                        Submit
                                    </button>
                                </form>
                            </div>

                            <div className="mt-8">
                                <h3 className="main-color text-2xl font-semibold">Reviews</h3>
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <div
                                            key={index}
                                            className="mt-4 p-4 border rounded flex justify-between items-start">
                                            <div>
                                                <p className="main-color">{review.content}</p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    {new Date(
                                                        review.createdAt
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteReview(review._id)}
                                                className="text-red-500 hover:text-red-700"
                                                aria-label="Delete review">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="mt-2">No reviews yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RequestDetails;
