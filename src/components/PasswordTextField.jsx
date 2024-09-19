import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import React from 'react';
import IconButton from './IconButton';
import TextField from './TextField';
import {IoLockClosed} from "react-icons/io5";

const PasswordTextField = React.forwardRef(
  ({ placeholder, ...others }, ref) => {
    const [passwordFieldType, setPasswordFieldType] = React.useState('password');

    /**
     * handle change password field type
     *
     * @return void
     */
    const handleChangePasswordFieldType = () => {
      setPasswordFieldType((value) =>
        value === 'password' ? 'text' : 'password'
      );
    };

    return (
      <TextField
        {...others}
        ref={ref}
        placeholder={placeholder || 'Password'}
        type={passwordFieldType}
        InputProps={{
          startAdornment: <IoLockClosed className="text-gray-400" />,
          endAdornment: (
            <IconButton onClick={handleChangePasswordFieldType} type="button">
              {passwordFieldType === 'text' ? (
                <FaEyeSlash className=" text-gray-400" />
              ) : (
                <FaEye className=" text-gray-400" />
              )}
            </IconButton>
          ),
        }}
      />
    );
  }
);

PasswordTextField.displayName = 'PasswordTextField';

export default PasswordTextField;
