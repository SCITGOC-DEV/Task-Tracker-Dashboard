import React from "react";

const SubmitButton = ({
  icon,
  bgColor,
  color,
  bgHoverColor,
  size,
  text,
  disabled,
  borderRadius,
  width,
}) => {
  return (
    <button
      type={"submit"}
      disabled={disabled}
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={` text-${size} flex items-center disabled:cursor-not-allowed justify-center p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
    >
      {icon} {text}
    </button>
  );
};

export default SubmitButton;