import AppDialog from "../../components/AppDialog";
import {Input} from "@material-tailwind/react";
import {InputWithError} from "../../components/InputWithError";
import {useEffect, useState} from "react";

const ReturnInventoryProjectDialog = ({open, onClose, totalQuantity, onConfirm}) => {
    const [inputValues, setInputValues] = useState({description: "", requestedAt: "", totalQuantity: null});
    const [inputValueError, setInputValueError] = useState({description: "", requestedAt: "", totalQuantity: ""});

    const validateTotalQuantity = () => {
        if (inputValues.totalQuantity > totalQuantity) setInputValueError({totalQuantity: "Quantity must not exceed than maximum quantity."})
        else setInputValueError({totalQuantity: ""})

        return inputValueError.totalQuantity?.trim().length === 0;
    }

    const handleTotalQuantityChange = (e) => {
        const result = e.target.value.replace(/[^0-9]/g, "")
        setInputValues({totalQuantity: result})
    }

    const handleConfirm = () => {
        const valid = validateTotalQuantity()
        if (valid) onConfirm({totalQuantity: inputValues.totalQuantity, description: inputValues.description || ""})
    }

    useEffect(() => {
        validateTotalQuantity()
    }, [inputValues.totalQuantity]);

    const content = (
        <>
            <div className="flex flex-col gap-4 mt-4">
                <InputWithError
                    placeholder="Enter description"
                    title="Description"
                    value={inputValues.description}
                    onChange={(e) => setInputValues({description: e.target.value})}
                />
                <InputWithError
                    placeholder="Enter quantity"
                    title="Total Quantity"
                    topError={`Maximum quantity: ${totalQuantity}`}
                    value={inputValues.totalQuantity}
                    error={inputValueError.totalQuantity}
                    onChange={handleTotalQuantityChange}
                />
            </div>
        </>
    )

    return (
        <AppDialog
            open={open}
            onClose={onClose}
            onConfirm={handleConfirm}
            cancelTitle="Cancel"
            confirmTitle="Return"
            title="Return Inventory"
            content={content}
        />
    )
}

export default ReturnInventoryProjectDialog;