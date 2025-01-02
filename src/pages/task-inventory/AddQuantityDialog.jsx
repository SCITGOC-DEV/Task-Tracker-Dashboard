import {useState} from "react";
import AppDialog from "../../components/AppDialog";
import {InputWithError} from "../../components/InputWithError";

const AddQuantityDialog = ({open, onClose, onConfirm}) => {
    const [quantity, setQuantity] = useState('');
    const [remark, setRemark] = useState('');

    const [quantityError, setQuantityError] = useState('');
    const [remarkError, setRemarkError] = useState('');

    const validate = () => {
        let valid = true
        if (!quantity || isNaN(quantity)) {
            valid = false
            setQuantityError("Quantity is required");
        }
        else setQuantityError("")

        if (!remark || !remark.trim()) {
            valid = false
            setRemarkError("Remark is required");
        } else setRemarkError("")

        return valid
    }

    const content = (
        <div className="flex-col gap-4 flex mt-8">
            <InputWithError
                title={"Quantity *"}
                placeholder="Enter quantity"
                value={quantity}
                error={quantityError}
                onChange={e => setQuantity(e.target.value.replace(/[^0-9]/g, ""))}
            />
            <InputWithError
                title={"Remark"}
                placeholder="Enter remark"
                value={remark}
                error={remarkError}
                onChange={e => setRemark(e.target.value)}
            />
        </div>
    )

    const handleOnConfirm = () => {
        if (validate()) {
            onClose()
            onConfirm({quantity,remark});
        }
    }

    return (
        <AppDialog
            title="Add Quantity"
            open={open}
            onClose={onClose}
            confirmTitle="Add"
            cancelTitle="Cancel"
            onConfirm={handleOnConfirm}
            content={content}
            />
    )
}

export default AddQuantityDialog;