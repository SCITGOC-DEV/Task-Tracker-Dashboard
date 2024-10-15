import {Md1K, MdDeck, MdModeEdit, MdOutlineDelete} from "react-icons/md";

export const AppConstants = {
    LOADING_DELAY : 500
}

export const ActionType = {
    Icon: "Icon",
    Dropdown: "Dropdown",
}

export const actions = [
    {
        type: ActionType.Dropdown,
        actions: [
            {
                label: "Add Inventory",
                icon: <MdDeck/>,
                onClick: (id) => console.log(id),
            },
            {
                label: "Add Task",
                icon: <Md1K/>,
                onClick: (id) => console.log(id),
            }
        ]
    },
    {
        type: ActionType.Icon,
        actions: [
            {
                label: "Add Inventory",
                icon: <MdModeEdit/>,
                onClick: (id) => console.log(id),
            },
            {
                label: "Add Task",
                icon: <MdOutlineDelete/>,
                onClick: (id) => console.log(id),
            }
        ]
    }
]