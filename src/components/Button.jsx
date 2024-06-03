import clsx from "clsx";
import React from "react";

const Button = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    component = "button",
    disabled,
    fullWidth,
    size = "medium",
    startIcon,
    endIcon,
    loading = false,
    ...others
  } = props;

  const classes = clsx(
    fullWidth && "w-full",
    "uppercase font-bold rounded text-white",
    disabled &&
      "bg-gray-600 bg-opacity-40 cursor-not-allowed text-gray-400 border-transparent",
    {
      "px-2 py-1": size === "small",
      "px-4 py-2": size === "medium",
      "px-6 py-4": size === "large",
    },
    (startIcon || endIcon) && "flex items-center",
    className
  );

  return React.createElement(
    component,
    {
      ...others,
      ref,
      className: classes,
    },
    <>
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </>
  );
});

Button.displayName = "Button";

export default Button;
