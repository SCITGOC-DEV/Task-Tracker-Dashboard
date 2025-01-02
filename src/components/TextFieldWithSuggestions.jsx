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
    const [tempSuggestions, setTempSuggestions] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setInputValue(value);
    },[value]);

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        onValueChange(newValue); // Pass the value to the parent handler

        /*if (newValue) {
            const filtered = suggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(newValue.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setTempSuggestions(filtered)
            setShow(true)
        } else {
            setShow(false)
            setFilteredSuggestions([]);
        }*/
    };

    const arraysAreEqual = (arr1, arr2) => {
        return JSON.stringify(arr1) === JSON.stringify(arr2);
    };

    useEffect(() => {
        if (filteredSuggestions.length === 0) setShow(false)
    }, [filteredSuggestions]);

    useEffect(() => {
        setTempSuggestions(suggestions)
        if (!arraysAreEqual(suggestions,tempSuggestions)) {
            setFilteredSuggestions(suggestions);
        }
    },[suggestions])

    useEffect(() => {
        if (filteredSuggestions.length > 0) setShow(true)
    }, [filteredSuggestions]);

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        onChange(suggestion); // Pass the selected suggestion to the parent handler
        setShow(false)
        setFilteredSuggestions([])
    };

    const handleOnBlur = () => {
        setShow(false)
    }

    return (
        <div className="flex flex-col gap-1 relative min-w-full">
            {/* Title */}
            <p className="text-gray-700">{title}</p>

            {/* Input Field with Suggestions */}
            <div className="relative">
                <input
                    className={`w-full py-2 pl-4 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
                    placeholder={placeholder}
                    value={inputValue}
                    onFocus={() => setShow(true)}
                    onChange={handleInputChange}
                />
                {show > 0 && (
                    <ul className="absolute left-0 right-0 mt-2 border border-gray-300 rounded-lg shadow-md max-h-40 overflow-auto bg-white z-10">
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
