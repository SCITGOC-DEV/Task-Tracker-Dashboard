import React, {useEffect, useState} from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { Button, Header, TextField } from "../../components";
import {Link, useNavigate, useParams} from "react-router-dom";
import PageRoutes from "../../utils/PageRoutes";
import { toast } from "react-toastify";
import {useLazyQuery, useMutation} from "@apollo/client";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { ActivityIndicator } from "react-native-web";
import { addInventoryCategory, getAllInventoryCategories } from "../../graphql/query/inventoryCategoryQueries";
import { InputWithError } from "../../components/InputWithError";
import { InputButton } from "../../components/InnputButton";
import { InputFieldWithSuggestion } from "../../components/TextFieldWithSuggestions";
import DatePicker from "react-datepicker";
import {ProjectStatusValues} from "../../utils/ProjectStatus";
import {
    ADD_PROJECT_QUERY,
    GET_ALL_PROJECTS,
    GET_PROJECT_BY_ID,
    UPDATE_PROJECT_BY_ID
} from "../../graphql/query/projectQueries";
import {AppConstants} from "../../utils/Constants";
import AppDropdown from "../../components/AppDropdown";

const UpdateProject = () => {
    const { currentColor } = useStateContext();
    const navigate = useNavigate()
    const {role} = useAuth()
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const {id} = useParams();

    const today = new Date().toISOString();

    // State for input values
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [percentage, setPercentage] = useState(0);
    const [status, setStatus] = useState(null);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [actualStartDate, setActualStartDate] = useState(null);
    const [actualEndDate, setActualEndDate] = useState(null);

    // State for error messages
    const [projectNameError, setProjectNameError] = useState('');
    const [startDateError, setStartDateError] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const [percentageError, setPercentageError] = useState('');

    const [getProjectById] = useLazyQuery (GET_PROJECT_BY_ID, {
        onCompleted: (result) => {
            const project = result.projects[0]

            setProjectName(project.project_name)
            setProjectDescription(project.project_description)
            setCreatedBy(project.created_by)
            setStartDate(project.start_date)
            setEndDate(project.end_date)
            setPercentage(project.percentage)
            setStatus(project.status)
            setActualStartDate(project.actual_start_date)
            setActualEndDate(project.actual_end_date)
        }
    })

    useEffect(() => {
        getProjectById({
            variables: {id: id}
        })
    },[])

    const [updateProject] = useMutation(UPDATE_PROJECT_BY_ID, {
        refetchQueries: [
            {
                query: GET_ALL_PROJECTS,
                variables: {},
                awaitRefetchQueries: true,
            },
        ],
        onCompleted: data => {
            setTimeout(() => {
                setLoading(false)
                navigate(PageRoutes.Projects)
                toast.success("Project updated successfully.");
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

        if (!percentage) {
            setPercentageError('Percentage is required');
            isValid = false;
        } else {
            setPercentageError('');
        }

        // Submit form if valid
        if (isValid) {
            setLoading(true)
            const variables = {
                id: id,
                project_name: projectName,
                project_description: projectDescription,
                created_by: createdBy,
                start_date: startDate,
                percentage: percentage,
                end_date: endDate,
                status: status,
                actual_start_date: actualStartDate,
                actual_end_date: actualEndDate,
                updated_at: new Date().toISOString()
            };

            updateProject({
                variables: variables
            })
        }
    };

    return (

        <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
            <Header title={"Update Project"} category="Pages" />
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

                    <InputWithError
                        className="min-w-full"
                        title="Created By *"
                        placeholder="Enter creator's name"
                        value={createdBy}
                        onChange={(e) => setCreatedBy(e.target.value)}
                        error=""
                    />

                    <InputWithError
                        className="min-w-full"
                        title="Percentage"
                        placeholder="Enter project percentage"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        error={percentageError}
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

                    {/* Status */}
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
                            'Update'
                        )}
                    </button>
                </div>
            </div>
        </div>

    )
}

export default UpdateProject;