import React from 'react';
import Link from 'next/link';

const Home = () => {
    return (
        <div>
            <h1>Welcome to TimeBank</h1>
            <p>Your platform for community help and support.</p>
            <Link href="/dashboard">Go to Dashboard</Link>
        </div>
    );
};

export default Home;
