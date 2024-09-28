import {Checkbox} from "@material-tailwind/react";

export function AppCheckBox({
                                title,
                                value,
                                onChange
                            }) {
    return (
        <div>
            <Checkbox defaultChecked label={title} checked={value} onChange={onChange}/>
        </div>
    );
}