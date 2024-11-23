import { useState, useEffect } from "react";
import styles from "@/styles/Messaging.module.css";

function Chat({ currentUser, chatPartner }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Fetch messages between the current user and chat partner
    useEffect(() => {
        async function fetchMessages() {
            try {
                const response = await fetch(
                    `/api/messages/get?user1=${currentUser}&user2=${chatPartner}`
                );
                const data = await response.json();
                if (data.success) {
                    setMessages(data.messages);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }
        fetchMessages();
    }, [currentUser, chatPartner]);

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
                setMessages((prevMessages) => [...prevMessages, data.message]);
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
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    className={styles.button}
                    onClick={() => sendMessage(newMessage)}
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
export default Chat;
