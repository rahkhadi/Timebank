import { useState, useEffect } from 'react';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const token = "your-auth-token"; // Replace with actual token logic

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications', {
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
    }, []); // Runs only on initial render

    return (
        <div>
            <h3>Notifications</h3>
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
    );
};

export default NotificationsPage;
