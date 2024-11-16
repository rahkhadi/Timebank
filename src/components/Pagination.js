// components/Pagination.js
import React from "react";

const Pagination = ({ pageCount, onPageChange, currentPage }) => {
  const getPageNumbers = () => {
    if (pageCount <= 3) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    if (currentPage === 1) {
      return [1, 2, 3];
    }

    if (currentPage === pageCount) {
      return [pageCount - 2, pageCount - 1, pageCount];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center mt-8" style={{ color: '#636363' }}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
      >
        &lt;
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === number
              ? "bg-blue-500 text-white text-lg font-bold"
              : "bg-gray-200"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
        disabled={currentPage === pageCount}
        className="mx-1 px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;