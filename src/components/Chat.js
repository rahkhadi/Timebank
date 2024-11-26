import React, { useState, useEffect } from "react"; // Added import for useState and useEffect
import styles from "@/styles/Messaging.module.css";

function Chat({ currentUser, chatPartner }) {
    const [messages, setMessages] = useState([]); // Initialize state for messages
    const [newMessage, setNewMessage] = useState(""); // Initialize state for newMessage

    // Fetch messages between the current user and chat partner
    useEffect(() => {
        async function fetchMessages() {
            try {
                const response = await fetch(
                    `/api/messages/get?user1=${currentUser}&user2=${chatPartner}`
                );
                const data = await response.json();
                if (data.success) {
                    setMessages(data.messages); // Set the fetched messages in state
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }
        fetchMessages();
    }, [currentUser, chatPartner]); // Dependencies to refetch if currentUser or chatPartner changes

    // Send a new message
    async function sendMessage() {
        try {
            const response = await fetch("/api/messages/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sender: currentUser,
                    receiver: chatPartner,
                    content: newMessage,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.message]); // Add the new message to state
                setNewMessage(""); // Clear the input field
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                Chat with {chatPartner}
            </div>
            <div className={styles.messages}>
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`${styles.message} ${
                            msg.sender === currentUser ? styles.self : styles.partner
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)} // Update the new message on input change
                />
                <button
                    className={styles.button}
                    onClick={sendMessage} // Send the message when the button is clicked
                    disabled={!newMessage.trim()} // Disable button if input is empty
                >
                    Send
                </button>
            </div>
        </div>
    );
}
export default Chat;
