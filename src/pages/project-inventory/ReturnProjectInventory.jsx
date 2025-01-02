import {useNavigate, useParams} from "react-router-dom";
import BackButton from "../../components/BackButton";
import AppIconButton from "../../components/AppIconButton";
import {IoMdCreate} from "react-icons/io";
import {FaTrash} from "react-icons/fa";
import React, {useState} from "react";
import {Header} from "../../components";
import {useMutation} from "@apollo/client";
import {RETURN_INVENTORY_PROJECT} from "../../graphql/query/projectInventoryQueries";
import { toast } from "react-toastify";

const ReturnProjectInventory = ({navigation}) => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const [returnProject] = useMutation(RETURN_INVENTORY_PROJECT, {
        onCompleted: data => {
            const response = data.response;
            setTimeout(() => {
                setLoading(false)
                if (response.success) toast.success("Returned project inventory successfully!")
                else toast.error(response.message);
            },500)
        },
        onError: error => {
            setLoading(false)
            toast.error(error.message)
        }
    })

    return (
        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
            <div className="flex mb-12 justify-between items-start">
                <BackButton onBackClick={() => navigate(-1)}/>
            </div>

            <div>
                <Header
                    title={`Return Project`}
                    category="Project"
                    showAddButton={false}
                />
            </div>
        </div>
    )
}

export default ReturnProjectInventory;