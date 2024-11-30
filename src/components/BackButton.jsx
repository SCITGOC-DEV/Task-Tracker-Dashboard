import React from "react";

const BackButton = ({onBackClick}) => {
    return (
        <button
            onClick={onBackClick}
            className="flex items-center mb-8 space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
        </button>
    )
}

export default BackButton;