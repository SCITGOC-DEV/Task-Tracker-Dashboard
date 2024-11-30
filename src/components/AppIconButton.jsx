import {IoAdd} from "react-icons/io5";
import React, {useEffect} from "react";

const AppIconButton = ({ icon, title, onClick, color, hoverColor }) => {

    const [backgroundColor, setBackgroundColor] = React.useState(color);

    useEffect(() => {
        setBackgroundColor(backgroundColor)
    }, [color]);

    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 p-2 px-4 rounded-lg ${color} text-white hover:${hoverColor} active:scale-95 transition-transform duration-150`}
        >
            {icon}
            <span>{title}</span>
        </button>
    );
}


export default AppIconButton;