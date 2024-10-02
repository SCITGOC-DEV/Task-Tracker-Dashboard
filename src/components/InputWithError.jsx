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
                    className= {`${className} border rounded p-2 `}
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