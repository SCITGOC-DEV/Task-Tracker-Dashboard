import React from "react";
import TextField from "./TextField";
import {FaEye, FaEyeSlash, FaLock, FaUser} from "react-icons/fa";
import IconButton from "./IconButton";
import {RiUser3Fill} from "react-icons/ri";

const AppTextField = React.forwardRef(
    ({ placeholder, ...others }, ref) => {

        return (
            <TextField
                {...others}
                ref={ref}
                placeholder={placeholder || 'Password'}
                type={"text"}
                InputProps={{
                    startAdornment: <RiUser3Fill className="text-gray-400" />,
                }}
            />
        );
    }
);

AppTextField.displayName = 'AppTextField';

export default AppTextField;
