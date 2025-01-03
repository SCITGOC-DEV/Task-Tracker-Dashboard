import React, { useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { Button, Header, TextField } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import PageRoutes from "../../utils/PageRoutes";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { ActivityIndicator } from "react-native-web";
import { addInventoryCategory, getAllInventoryCategories } from "../../graphql/query/inventoryCategoryQueries";
import { InputWithError } from "../../components/InputWithError";
import { InputButton } from "../../components/InnputButton";
import { InputFieldWithSuggestion } from "../../components/TextFieldWithSuggestions";
import DatePicker from "react-datepicker";
import {ProjectStatusValues} from "../../utils/ProjectStatus";
import {ADD_PROJECT_QUERY, GET_ALL_PROJECTS} from "../../graphql/query/projectQueries";
import {AppConstants} from "../../utils/Constants";
import {InventoryStatusWithStatus} from "../../utils/ProjectInventoryStatus";
import AppDropdown from "../../components/AppDropdown";

const AddProject = () => {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const {userName} = useAuth()
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const today = new Date().toISOString();

    // State for input values
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [status, setStatus] = useState(ProjectStatusValues[0]);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [actualStartDate, setActualStartDate] = useState(null);
    const [actualEndDate, setActualEndDate] = useState(null);

    // State for error messages
    const [projectNameError, setProjectNameError] = useState('');
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');

    const [addProject] = useMutation(ADD_PROJECT_QUERY, {
        refetchQueries: [
            {
                query: GET_ALL_PROJECTS,
                variables: {},
                awaitRefetchQueries: true,
            },
        ],
        onCompleted: data => {
            setTimeout(() => {
                const response = data.response;
                if (response.success) {
                    setLoading(false)
                    navigate(-1);
                    toast.success("New project is added successfully.");
                } else toast.error(response.message)
            }, AppConstants.LOADING_DELAY)
        },
        onError: (e) => {
            setLoading(false)
            toast.error(e.message)
        }
    })

    // Handle form validation on button click
    const handleSubmit = () => {
        let isValid = true;

        // Validation for required fields
        if (!projectName) {
            setProjectNameError('Project name is required');
            isValid = false;
        } else {
            setProjectNameError('');
        }

        if (!startDate) {
            setStartDateError('Start date is required');
            isValid = false;
        } else {
            setStartDateError('');
        }

        if (!endDate) {
            setEndDateError('End date is required');
            isValid = false;
        } else {
            setEndDateError('');
        }

        // Submit form if valid
        if (isValid) {
            setLoading(true)
            const variables = {
                project_name: projectName,
                project_description: projectDescription,
                start_date: startDate,
                end_date: endDate,
                status: status,
                percentage: 0
            };
            console.log(variables)
            addProject({
                variables: variables
            })
        }
    };

    return (

        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <Header title={"Add Project"} category="Pages" />
            <Link
                to={PageRoutes.Projects}
                className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
                style={{ background: currentColor }}
            >
                Back
            </Link>

            <div className="w-full flex flex-col justify-center items-center">
                <div
                    className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">
                    {/* Project Name (Required) */}
                    <InputWithError
                        className="min-w-full"
                        title="Project Name *"
                        placeholder="Enter project name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        error={projectNameError}
                    />

                    {/* Project Description */}
                    <InputWithError
                        className="min-w-full"
                        title="Project Description"
                        placeholder="Enter project description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        error=""
                    />

                    {/* Start Date (Button) */}
                    <InputButton
                        className="min-w-full"
                        title="Start Date *"
                        buttonTitle={startDate || 'Select Start Date'}
                        onClick={(date) => {
                            setStartDate(date);
                            setShow(true)// Example date selection
                        }}
                        error={startDateError}
                    />

                    {/* End Date (Button) */}
                    <InputButton
                        className="min-w-full"
                        title="End Date *"
                        buttonTitle={endDate || 'Select End Date'}
                        onClick={(date) => {
                            // Handle end date selection logic here
                            setEndDate(date); // Example date selection
                        }}
                        error={endDateError}
                    />

                    <AppDropdown
                        title="Status"
                        value={status}
                        options={ProjectStatusValues}
                        onSelected={(value) => setStatus(value)}/>

                    {/* Actual Start Date (Button) */}
                    <InputButton
                        className="min-w-full"
                        title="Actual Start Date *"
                        buttonTitle={actualStartDate || 'Select Actual Start Date'}
                        onClick={(date) => {
                            // Handle actual start date selection
                            setActualStartDate(date); // Example date selection
                        }}
                        error=""
                    />

                    {/* Actual End Date (Button) */}
                    <InputButton
                        className="min-w-full"
                        title="Actual End Date *"
                        buttonTitle={actualEndDate || 'Select Actual End Date'}
                        onClick={(date) => {
                            // Handle actual end date selection
                            setActualEndDate(date); // Example date selection
                        }}
                        error=""
                    />

                    {/* Submit Button */}
                    <button
                        className="bg-blue-500 mt-4 min-w-full text-white py-2 px-4 rounded"
                        onClick={handleSubmit}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            'Add'
                        )}
                    </button>
                </div>
            </div>
        </div>

    )
}

export default AddProject;