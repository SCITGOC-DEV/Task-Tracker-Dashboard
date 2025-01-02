import {useEffect, useState} from "react";
import {InputWithError} from "../../components/InputWithError";
import AppDialog from "../../components/AppDialog";
import {InputButton} from "../../components/InnputButton";

const ReturnTaskInventoryDialog = ({open, onClose, totalQuantity, onConfirm}) => {
    const [inputValues, setInputValues] = useState({description: "", requestedAt: "", totalQuantity: null});
    const [inputValueError, setInputValueError] = useState({description: "", requestedAt: "", totalQuantity: ""});

    const [description, setDescription] = useState("")
    const [remark, setRemark] = useState("")
    const [returnDate, setReturnDate] = useState("")
    const [returnQty, setReturnQty] = useState("")

    const [descriptionError, setDescriptionError] = useState("")
    const [remarkError, setRemarkError] = useState("")
    const [returnDateError, setReturnDateError] = useState("")
    const [returnQtyError, setReturnQtyError] = useState("")

    const validateTotalQuantity = () => {
        let isValid = true;

        if (returnQty > totalQuantity) {
            setReturnQtyError("Quantity must not exceed than maximum quantity.")
            isValid = false
        } else setReturnQtyError("")

        if (!returnDate || returnDate.trim().length === 0) {
            setReturnDateError("Return date is required")
            isValid = false
        } else setReturnDateError("")

        return isValid;
    }

    const handleTotalQuantityChange = (e) => {
        const result = e.target.value.replace(/[^0-9]/g, "")
        setReturnQty(result)
    }

    const handleConfirm = () => {
        const valid = validateTotalQuantity()

        if (valid) onConfirm({
            description: description,
            remark: remark,
            returnDate: returnDate,
            returnQty: returnQty,
        })
    }

    useEffect(() => {
        validateTotalQuantity()
    }, [returnDate, returnQty]);

    const content = (
        <>
            <div className="flex flex-col gap-4 mt-4">
                <InputWithError
                    placeholder="Enter description"
                    title="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <InputButton title={"Select Return Date"} onClick={(date) => setReturnDate(date)}
                             error={returnDateError}/>
                <InputWithError
                    placeholder="Enter quantity"
                    title="Total Quantity"
                    topError={`Maximum quantity: ${totalQuantity}`}
                    value={returnQty}
                    error={returnQtyError}
                    onChange={handleTotalQuantityChange}
                />
                <InputWithError
                    placeholder="Enter remark"
                    title="Remark"
                    value={remark}
                    error={remarkError}
                    onChange={(e) => setRemark(e.target.value)}
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

export default ReturnTaskInventoryDialog;