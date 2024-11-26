import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css'; // Ensure the path is correct

const Home = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Welcome to TimeBank</h1>
                <p className={styles.subtitle}>
                    Your platform for exchanging timecoins instead of cash.
                </p>
            </header>
            <main className={styles.main}>
                <section className={styles.introSection}>
                    <p className={styles.description}>
                        TimeBank allows you to use timecoins to trade services with your community, fostering mutual support and growth.
                    </p>
                    {/* Remove the <a> tag */}
                    <Link href="/dashboard" className={styles.linkButton}>
                        Go to Dashboard
                    </Link>
                </section>
            </main>
           
        </div>
    );
};

export default Home;
