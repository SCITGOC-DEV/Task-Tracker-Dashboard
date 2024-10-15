import React, { useEffect, useState } from 'react';

export default function AlertSnackbar({ message, className }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (message) {
            setOpen(true);

            // Automatically hide the alert after 3 seconds
            const timer = setTimeout(() => {
                setOpen(false);
                // Allow time for transition before setting visibility to false
                setTimeout(() => setVisible(false), 500); // Match duration-500
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    //if (!visible) return null; // Do not render anything if not visible

    return (
        <div
            className={`flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition-opacity transform duration-500 ease-in-out ${
                open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'
            } ${className}`}
            role="alert"
        >
            <svg
                className="flex-shrink-0 inline w-4 h-4 mr-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>{message}</div>
        </div>
    );
}
