import { useState, useEffect } from 'react';

const NotificationsDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const token = "your-auth-token"; // Replace with actual token logic

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications/index', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token here
                },
            });

            const data = await response.json();

            if (response.ok) {
                setNotifications(data.data); // Update the notifications state
            } else {
                console.error('Error fetching notifications:', data.error);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button onClick={toggleDropdown}>🔔 Notifications</button>
            {isOpen && (
                <div className="dropdown">
                    <h4>Notifications</h4>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification._id}>
                                <p>{notification.message}</p>
                            </div>
                        ))
                    ) : (
                        <p>No notifications</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
