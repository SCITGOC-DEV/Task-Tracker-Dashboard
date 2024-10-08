import clsx from "clsx";
import React from "react";

const TextField = React.forwardRef(
    (
        {
            children,
            className,
            fullWidth,
            error,
            helperText,
            InputProps,
            maxRows,
            minRows,
            multiline,
            type = "text",
            disabled,
            inputSize = "medium",
            variant = "outlined",
            ...others
        },
        ref
    ) => {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                {className: "relative"},
                InputProps?.startAdornment &&
                React.createElement(
                    "span",
                    {
                        className:
                            "select-none absolute top-1/2 left-3 right-auto transform -translate-y-1/2",
                    },
                    InputProps.startAdornment
                ),
                React.createElement(
                    "input",
                    Object.assign({}, others, {
                        type: type,
                        ref: ref,
                        disabled: disabled,
                        className: clsx(
                            "block w-full rounded-lg border bg-inherit border-gray-400 placeholder-slate-400 dark:placeholder-slate-300  dark:text-white disabled:text-gray-500 dark:disabled:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:ring-0 hover:ring-1 dark:hover:ring-white hover:ring-black invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500",
                            {
                                "px-4 py-[8.5px]": inputSize === "small",
                                "px-4 py-[16.5px]": inputSize === "medium",
                            },
                            fullWidth ? "max-w-full" : "max-w-sm",
                            error && "!border-red-600 placeholder-red-600",
                            InputProps?.startAdornment && "!pl-10",
                            InputProps?.endAdornment && "!pr-10",
                            className
                        ),
                    })
                ),
                InputProps?.endAdornment &&
                React.createElement(
                    "span",
                    {
                        className:
                            "select-none absolute top-1/2 left-auto transform -translate-y-1/2 right-2",
                    },
                    InputProps.endAdornment
                )
            ),
            helperText &&
            React.createElement(
                "span",
                {
                    className: clsx(
                        "text-sm  mt-[3px] px-[14px]",
                        error && "text-red-600"
                    ),
                },
                helperText
            )
        );
    }
);

TextField.displayName = "TextField";

export default TextField;