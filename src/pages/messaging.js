import Chat from "@/components/Chat";

export default function MessagingPage() {
    const currentUser = "currentUserId"; // Replace with the logged-in user's ID
    const chatPartner = "chatPartnerId"; // Replace with the other user's ID

    return (
        <div>
            <h1>Messaging System</h1>
            <Chat currentUser={currentUser} chatPartner={chatPartner} />
        </div>
    );
}
