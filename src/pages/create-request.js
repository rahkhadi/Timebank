import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/CreateRequest.module.css';

const CreateRequest = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [timeCoins, setTimeCoins] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('timeCoins', timeCoins);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post('/api/requests/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Request created successfully!');
            setTitle('');
            setDescription('');
            setTimeCoins('');
            setImage(null);
        } catch (error) {
            console.error('Error creating request:', error.response?.data || error.message);
            setMessage('Failed to create request');
        }
    };

    return (
        <div className={styles.createRequestContainer}>
            <h2>Create a New Request</h2>
            {message && <p className={styles.message}>{message}</p>}
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={styles.inputField}
                />

                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className={styles.textareaField}
                />

                <label>TimeCoins</label>
                <input
                    type="number"
                    value={timeCoins}
                    onChange={(e) => setTimeCoins(e.target.value)}
                    required
                    className={styles.inputField}
                />

                <label>Upload Image</label>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                    className={styles.inputFile}
                />

                <button type="submit" className={styles.submitButton}>
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default CreateRequest;
