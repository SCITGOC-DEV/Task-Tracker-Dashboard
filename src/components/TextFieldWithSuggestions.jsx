import React, {useEffect, useState} from 'react';
import { Input } from "@material-tailwind/react"; // Adjust the import according to your Input component

export const InputFieldWithSuggestion = ({
    className,
    title,
    placeholder,
    suggestions,
    value,
    onChange,
    onValueChange = () => {},
    onFocus,
    onBlur,
    error,
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setInputValue(value);
    },[value]);

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        onValueChange(newValue); // Pass the value to the parent handler

        if (newValue) {
            const filtered = suggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(newValue.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        console.log(suggestion)
        setInputValue(suggestion);
        onChange(suggestion); // Pass the selected suggestion to the parent handler
        setFilteredSuggestions([]);
    };

    return (
        <div className="flex flex-col gap-1 relative min-w-full">
            {/* Title */}
            <p className="text-gray-700">{title}</p>

            {/* Input Field with Suggestions */}
            <div className="relative">
                <input
                    className={`border border-gray-300 rounded p-2 ${className}`}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                />
                {filteredSuggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 mt-2 border border-gray-300 max-h-40 overflow-auto bg-white z-10">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="cursor-pointer p-2 hover:bg-gray-200"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};
