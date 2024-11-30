import react from 'react';
import {useNavigate} from "react-router-dom";

export const goBack = () => {
    const navigate = useNavigate()
    navigate(-1)
}