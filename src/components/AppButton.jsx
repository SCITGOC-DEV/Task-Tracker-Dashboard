import PageRoutes from "../utils/PageRoutes";
import {Link} from "react-router-dom";
import React from "react";
import {useStateContext} from "../contexts/ContextProvider";

const AppButton = ({title,route}) => {
    const { currentColor } = useStateContext();

    return (
        <Link
            to={route}
            className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
            style={{background: currentColor}}
        >
            {title}
        </Link>
    )
}

export default AppButton;