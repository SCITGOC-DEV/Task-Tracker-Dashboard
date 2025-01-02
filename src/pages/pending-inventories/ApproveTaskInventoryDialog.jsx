import {useEffect, useState} from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import {InputWithError} from "../../components/InputWithError";
import {useLocation} from "react-router-dom";
import {useLazyQuery} from "@apollo/client";
import {GET_INVENTORY_BY_ID, GET_RETURN_INVENTORY_TOTAL_BY_ID} from "../../graphql/query/inventoryQueries";

export default function ApproveTaskInventoryDialog({ open, onClose, onConfirm, inventoryId, requestQuantity }) {
    const [remark, setRemark] = useState('')
    const [remarkError, setRemarkError] = useState('')

    const [approvedQuantity, setApprovedQuantity] = useState(null)
    const [quantityError, setQuantityError] = useState('')

    const [totalQuantity, setTotalQuantity] = useState('')

    const [getInventoryDetails] = useLazyQuery(GET_RETURN_INVENTORY_TOTAL_BY_ID, {
        onCompleted: data => {
            const response = data.response[0]
            setTotalQuantity(response.total_qty)
        },
        onError: error => {
            console.log(error.message)
        }
    })

    const validate = () => {
        return validateApprovedQuantity()
    }

    const handleOnConfirm = () => {
        if (validate() === true) onConfirm(remark, approvedQuantity)
    }

    const validateApprovedQuantity = () => {
        if (approvedQuantity > requestQuantity) setQuantityError("Approved quantity must not exceed than request quantity")
        else setQuantityError("")

        if (approvedQuantity > totalQuantity) setQuantityError("Approved quantity must not exceed than maximum quantity")
        else setQuantityError("")

        return (quantityError.trim().length === 0)
    }

    const handleOnApprovedQuantityChange = (e) => {
        const result = e.target.value.replace(/[^0-9]/g, "")
        setApprovedQuantity(result)
    }

    useEffect(() => {
        validateApprovedQuantity()
    }, [approvedQuantity]);

    useEffect(() => {
        setRemark('')
        console.log(inventoryId)
        getInventoryDetails({variables: {taskId: inventoryId}})
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 flex-1 flex-col sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                        Approve Inventory
                                    </DialogTitle>
                                    <div className="mt-8 w-full flex-1 flex flex-col gap-4">
                                        <InputWithError
                                            value={approvedQuantity}
                                            onChange={handleOnApprovedQuantityChange}
                                            title={"Approved Quantity"}
                                            error={quantityError}
                                            placeholder="Enter approved quantity"
                                            topError={`Maximum quantity: ${totalQuantity}`}
                                        />
                                        <InputWithError
                                            value={remark}
                                            onChange={(e) => setRemark(e.target.value)}
                                            title={"Description"}
                                            error={remarkError}
                                            placeholder="Enter description"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={handleOnConfirm}
                                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            >
                                Done
                            </button>
                            <button
                                type="button"
                                data-autofocus
                                onClick={onClose}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}