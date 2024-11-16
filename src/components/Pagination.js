import React from 'react';
import styles from '../styles/Pagination.module.css'; // Create styles if necessary

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className={styles.paginationContainer}>
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={styles.paginationButton}
            >
                Prev
            </button>
            <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
