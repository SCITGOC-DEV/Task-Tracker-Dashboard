import React, {useEffect} from 'react';
import {ExclamationCircleIcon} from "@heroicons/react/24/outline";


export default function EmptyState({title,description, className = ""}) {
    const [isVisible, setVisible] = React.useState(false);

    useEffect(() => {
        setTimeout(() => {
            setVisible(true);
        },200)
    },[])

    return (
        <div className={`flex flex-col items-center justify-center ${className} transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Icon */}
            <div className="mb-4">
                <ExclamationCircleIcon className="w-16 h-16 text-gray-400" />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>

            {/* Description */}
            <p className="text-gray-500 mb-6">{description}</p>
        </div>
    );
}
