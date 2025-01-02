import React, {useEffect, useState} from "react";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import AppTextField from "./AppTextField";
import {InputWithError} from "./InputWithError";
import {CSSTransition} from "react-transition-group";
import './modal.css';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import AppButton from "./AppButton";
import {ActivityIndicator} from "react-native-web";

const ChangePasswordModal = ({isOpen, onClose, onSubmit}) => {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [isOpen]);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({oldPassword: null, newPassword: null, confirmPassword: null});
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        setErrors({oldPassword: null, newPassword: null, confirmPassword: null})
    }, [isOpen]);


    const handleSubmit = () => {
        let hasErrors = false;
        let newErrors = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        };

        // Validate fields
        if (!oldPassword) {
            newErrors.oldPassword = "Old password is required.";
            hasErrors = true;
        }

        if (!newPassword) {
            newErrors.newPassword = "New password is required.";
            hasErrors = true;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password.";
            hasErrors = true;
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "New passwords do not match.";
            hasErrors = true;
        }

        // If any errors, update the error state and return
        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        // If no errors, call the onSubmit callback

        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="flex flex-col transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white w-full px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="">
                                <div className="mt-3 text-center sm:mt-0 sm:text-center">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        Change User Password
                                    </DialogTitle>

                                    <div className="mt-4 gap-4 flex flex-col">
                                        <InputWithError
                                            title={"Old Password"}
                                            error={errors.oldPassword}
                                            onChange={(value) => setOldPassword(value.target.value)}
                                            placeholder={"Enter old password"}
                                        />
                                        <InputWithError
                                            title={"New Password"}
                                            error={errors.newPassword}
                                            onChange={(value) => setNewPassword(value.target.value)}
                                            placeholder={"Enter new password"}
                                        />
                                        <InputWithError
                                            title={"Confirm Password"}
                                            error={errors.confirmPassword}
                                            onChange={(value) => setConfirmPassword(value.target.value)}
                                            placeholder={"Enter confirm password"}
                                        />

                                        <button
                                            className="bg-blue-500 mt-4 min-w-full text-white py-2 px-4 rounded"
                                            onClick={handleSubmit}
                                        >
                                            {loading ? (
                                                <ActivityIndicator size="small" color="#ffffff"/>
                                            ) : (
                                                'Change Password'
                                            )}
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>

        /*<Dialog open={isOpen} onClose={onClose}>
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >

                    </DialogPanel>
                </div>
            </div>
        </Dialog>*/
    );
};

export default ChangePasswordModal;
