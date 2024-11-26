import { useEffect, useState } from "react";
import Chat from "@/components/Chat";

export default function MessagingPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [chatPartner, setChatPartner] = useState("chatPartnerId"); // Replace with the actual chat partner's ID
    const [loading, setLoading] = useState(true);

    // Fetch the current user's ID from localStorage or session storage
    useEffect(() => {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        if (token) {
            // You can decode the JWT to get user information, or fetch it from an API endpoint if needed
            const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the token
            setCurrentUser(decodedToken.userId); // Assuming the JWT contains the userId field
        } else {
            // Redirect to login or show an error message
            console.log("User is not logged in");
        }
        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Messaging System</h1>
            {currentUser ? (
                <Chat currentUser={currentUser} chatPartner={chatPartner} />
            ) : (
                <p>Please log in to view the messaging system.</p>
            )}
        </div>
    );
}
