import { Input } from "@material-tailwind/react";
import React from "react";

export const InputWithError = ({
    className,
    title,
    placeholder,
    value,
    onChange,
    error
}) => {
    return (
        <div>
            <p className={`mb-1 min-w-full`}>{title}</p>
                <Input
                    className= {`${className} w-full py-2 pl-4 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                    placeholder={placeholder}
                    onChange={onChange}
                    value={value}
                />
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    )
}