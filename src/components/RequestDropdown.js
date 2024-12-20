import Link from "next/link";
import { useEffect, useRef } from "react";

const RequestDropdown = ({ requests, onClose }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Close dropdown on outside click
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose(); // Call the onClose function to close the dropdown
            }
        };

        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={dropdownRef}
            className="absolute bg-white border border-gray-300 rounded-lg shadow-md w-full max-h-96 overflow-y-auto z-10 mt-2"
        >
            {requests.length > 0 ? (
                requests.map((request) => (
                    <Link href={`/timecoin/${request._id}`} key={request._id} passHref>
                        <div
                            className="flex items-start p-2 border-b border-gray-200 hover:bg-gray-100 w-full text-left cursor-pointer"
                            onClick={onClose}
                        >
                            <div className="ml-2">
                                <p className="text-lg font-semibold">{request.title}</p>
                                <p className="text-gray-500">
                                    <strong>TimeCoins:</strong> {request.timeCoins}
                                </p>
                                <p className="text-gray-400 text-sm">{request.description.slice(0, 50)}...</p>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="p-4 text-center text-gray-500">No results found.</div>
            )}
        </div>
    );
};

export default RequestDropdown;
