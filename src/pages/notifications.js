import { useState, useEffect } from 'react';
import cookie from 'js-cookie'; // Import a cookie library if using cookies

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');

    const fetchNotifications = async () => {
        const token = cookie.get('token'); // Retrieve token from cookies

        if (!token) {
            setError('User is not authenticated');
            return;
        }

        try {
            const response = await fetch('/api/notifications', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            });

            const data = await response.json();

            if (response.ok) {
                setNotifications(data.data); // Update state with notifications
            } else {
                console.error('Error fetching notifications:', data.error);
                setError(data.error || 'Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('An unexpected error occurred');
        }
    };

    useEffect(() => {
        fetchNotifications(); // Fetch notifications on component mount
    }, []);

    return (
        <div>
            <h3>Notifications</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
