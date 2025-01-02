import AppDialog from "../../components/AppDialog";
import {InputWithError} from "../../components/InputWithError";
import {useState} from "react";

const ChangeProjectAdminPasswordDialog = ({open, onClose, onConfirm}) => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const validate = () => {
        return password === confirmPassword &&
            password.length !== 0 &&
            confirmPassword.length !== 0;
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleOnConfirm = () => {
        if (validate()) onConfirm(password)
        else setConfirmPasswordError("Passwords do not match!")
    }

    const content = (
        <div className="gap-4 flex flex-col mt-4">
            <InputWithError
                value={password}
                onChange={handlePasswordChange}
                title={"Password"}
                type={"password"}
                placeholder="Enter password"
            />
            <InputWithError
                value={confirmPassword}
                title={"Confirm Password"}
                placeholder="Enter confirm password"
                type={"password"}
                onChange={handleConfirmPasswordChange}
                error={confirmPasswordError}
            />
        </div>
    )
    return (
        <AppDialog
            open={open}
            onClose={onClose}
            title="Change Password"
            onConfirm={handleOnConfirm}
            content={content}
            cancelTitle="Cancel"
            confirmTitle="Confirm"
        />
    )
}

export default ChangeProjectAdminPasswordDialog;