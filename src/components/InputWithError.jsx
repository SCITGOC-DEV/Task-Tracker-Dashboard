import { Input } from "@material-tailwind/react";
import React from "react";

import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export const InputWithError = ({
                                   className,
                                   title,
                                   placeholder,
                                   value,
                                   onChange,
                                   error,
                                   topError = null,
                                   pattern = "string",
                                   type = "text",
                                   disabled = false, // New prop for disabling the input
                               }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isPassword = type === "password";

    return (
        <div>
            <div className="flex justify-between">
                <p className={`mb-1`}>{title}</p>
                {topError && <p className={`mb-1 text-red-500`}>{topError}</p>}
            </div>
            <div className="relative">
                <input
                    className={`${className} w-full py-2 pl-4 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                    pattern={pattern}
                    type={isPassword && showPassword ? "text" : type}
                    disabled={disabled} // Add disabled attribute
                />
                {isPassword && !disabled && ( // Only show eye icon if not disabled
                    <span
                        className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? (
                            <AiFillEyeInvisible className="text-gray-500" />
                        ) : (
                            <AiFillEye className="text-gray-500" />
                        )}
                    </span>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};
