import React from 'react';
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider";
import {IoAdd} from "react-icons/io5";

const Header = ({ category, title, showAddButton = true, icon= <IoAdd/>, onAddButtonClick= () => {} , buttonTitle = "Add Task" }) => {

    return(
        <div className="mb-5 flex items-center justify-between">
            <div>
                <p className="text-3xl dark:text-white font-extrabold tracking-tight secondary-dark-bg">
                    {title}
                </p>
                <p className="text-lg text-gray-500 py-2">{category}</p>
            </div>

            {showAddButton && (
                <div className="flex justify-end">
                    <button
                        onClick={onAddButtonClick}
                        className="flex items-center bg-blue-500 space-x-2 p-2 px-4 rounded-lg text-white hover:bg-blue-600 active:scale-95 transition-transform duration-150"
                    >
                        {icon}
                        <span>{buttonTitle}</span>
                    </button>
                </div>

            )}
        </div>

    );
}

export default Header;
