import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import { useAuth } from "@/context/AuthContext";

const MessagingPage = () => {
    const router = useRouter();
    const { id: chatPartnerId } = router.query; // Extract chat partner ID from the route
    const { currentUser, isLoggedIn } = useAuth();

    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login"); // Redirect to login if the user is not authenticated
        }

        if (!chatPartnerId) {
            setError("Chat partner not found.");
        }
    }, [isLoggedIn, chatPartnerId]);

    if (!isLoggedIn) {
        return null; // Avoid rendering anything until authenticated
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div>
            <h1>Chat with {chatPartnerId}</h1>
            <Chat currentUser={currentUser?._id} chatPartner={chatPartnerId} />
        </div>
    );
};

export default MessagingPage;
