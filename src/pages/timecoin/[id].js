import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/RequestDetails.module.css";

const RequestDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [request, setRequest] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchRequestDetails = async () => {
            try {
                const response = await axios.get(`/api/requests/${id}`);
                setRequest(response.data);
            } catch (err) {
                console.error("Error fetching request details:", err.message);
                setError("Failed to load request details.");
            }
        };

        fetchRequestDetails();
    }, [id]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!request) {
        return <p className="loading">Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <h1>{request.title}</h1>
            <p>{request.description}</p>
            <p>
                <strong>TimeCoins:</strong> {request.timeCoins}
            </p>
            {request.imageUrl && <img src={request.imageUrl} alt={request.title} className={styles.image} />}
        </div>
    );
};

export default RequestDetails;
