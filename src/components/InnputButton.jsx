import React, {useState} from "react";
import { Datepicker } from "flowbite-react";


export const InputButton = ({className, onClick, error, title, buttonTitle}) => {
    const [show, setShow] = useState(false)
    const handleChange = (selectedDate) => {
        console.log(selectedDate.toISOString())
        onClick(selectedDate.toISOString())
    }
    const handleClose = (state) => {
        setShow(state)
    }

    return (
        <div>
            <p className="text-gray-700">{title}</p>
            <Datepicker
                onSelectedDateChanged={handleChange}
            />
        </div>
    )
}