import React, {useEffect, useState} from "react";
import {useStateContext} from "../../../contexts/ContextProvider";
import {Header} from "../../../components";
import {Link, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {useLazyQuery, useMutation} from "@apollo/client";
import useAuth from "../../../hooks/useAuth";
import {ActivityIndicator} from "react-native-web";
import {InputWithError} from "../../../components/InputWithError";
import {InputFieldWithSuggestion} from "../../../components/TextFieldWithSuggestions";
import {AppConstants} from "../../../utils/Constants";
import {GET_PROJECT_NAMES} from "../../../graphql/query/projectInventoryQueries";
import PageRoutes from "../../../utils/PageRoutes";
import {InputButton} from "../../../components/InnputButton";
import {GET_LOCATIONS, GET_TASK_BY_ID, UPDATE_TASK_BY_ID} from "../../../graphql/query/getAllTasks";
import {AppCheckBox} from "../../../components/AppCheckBox";
import {ProjectStatusValues} from "../../../utils/ProjectStatus";
import AppDropdown from "../../../components/AppDropdown";
import BackButton from "../../../components/BackButton";
import {goBack} from "../../../utils/Methods";
import AppIconButton from "../../../components/AppIconButton";
import {IoMdCreate} from "react-icons/io";
import {FaTrash} from "react-icons/fa";

const EditTask = () => {
  const {currentColor} = useStateContext();
  const navigate = useNavigate()
  const {role} = useAuth()
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());

  const today = new Date().toISOString();
  const {projectId, taskId} = useParams()

  console.log(`projectId: ${projectId} - taskId: ${taskId}`)

  // State management
  const [locationName, setLocationName] = useState('');
  const [project, setProject] = useState('');
  //const [projectId, setProjectId] = useState('')
  const [taskName, setTaskName] = useState('');
  const [hardware, setHardware] = useState('');
  const [percentage, setPercentage] = useState(0)
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actualStartDate, setActualStartDate] = useState(null);
  const [actualEndDate, setActualEndDate] = useState(null);
  const [status, setStatus] = useState(null)

  // Error states
  const [locationError, setLocationError] = useState('');
  const [projectError, setProjectError] = useState('');
  const [taskNameError, setTaskNameError] = useState('');
  const [hardwareError, setHardwareError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [percentageError, setPercentageError] = useState('')
  const [endDateError, setEndDateError] = useState('');
  const [dispatch, setDispatch] = useState(null);

  const [getTaskById] = useLazyQuery(GET_TASK_BY_ID, {
    onCompleted: data => {
      const task = data.tasks[0];
      console.log(data)
      setLocationName(task.fk_location_name || '');
      setProject(task.project?.project_name || '');
      setTaskName(task.task_name || '');
      setPercentage(task.percentage || 0);
      setHardware(task.hardware || '');
      setQuantity(task.quantity || '');
      setStartDate(task.start_date_time || today);
      setEndDate(task.end_date_time || today);
      setStatus(task.status);
      setDispatch(task.dispatch);
    }
  })

  useEffect(() => {
    getTaskById({
      variables: {id: taskId}
    })
  }, []);

  // Validate inputs before submission
  const validateInputs = () => {
    let isValid = true;

    // Reset errors
    setLocationError('');
    setProjectError('');
    setTaskNameError('');
    setHardwareError('');
    setQuantityError('');
    setStartDateError('');
    setEndDateError('');
    setPercentageError('')

    if (!locationName) {
      setLocationError('Location Name is required.');
      isValid = false;
    }
    if (!taskName) {
      setTaskNameError('Task Name is required.');
      isValid = false;
    }

    return isValid;
  };

  const [projectNames, setProjectNames] = useState([]);
  const [locations, setLocations] = useState([]);

  const [getProjectNames] = useLazyQuery(GET_PROJECT_NAMES, {
    onCompleted: data => {
      console.log(data)
      setProjectNames(data.projects)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const [getLocations] = useLazyQuery(GET_LOCATIONS, {
    onCompleted: data => {
      console.log(data)
      setLocations(data.location)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const [updateTask] = useMutation(UPDATE_TASK_BY_ID, {
    refetchQueries: [{query: GET_TASK_BY_ID, variables: {taskId: taskId}}],
    onCompleted: data => {
      setTimeout(() => {
        setLoading(false)
        toast.success("Updated task successfully")
        navigate(-1)
      }, [AppConstants.LOADING_DELAY])
    },
    onError: (error) => {
      setLoading(false)
      toast.error(error.message)
    }
  })

  // Handle form validation on button click
  const handleSubmit = () => {
    if (validateInputs()) {
      // Submit data or perform action
      setLoading(true)
      const variables = {
        id: taskId,
        fk_location_name: locationName,
        fk_project_id: projectId,
        task_name: taskName,
        hardware: hardware,
        quantity: quantity,
        note: note,
        percentage: percentage,
        start_date_time: startDate,
        end_date_time: endDate,
        dispatch: dispatch,
        status: status,
        actual_start_date_time: actualStartDate,
        actual_end_date_time: actualEndDate
      }
      updateTask({
        variables: variables
      })
    }
  };

  const handleOnLocationChange = (query) => {
    getLocations({
      variables: {query: `${query}%`}
    })
  }

  return (

      <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
        <div className="flex mb-4 justify-between items-start">
          <BackButton onBackClick={() => navigate(-1)}/>
        </div>
        <Header title={"Update Task"} category="Pages" showAddButton={false}/>

        <div className="w-full flex flex-col justify-center items-center">
          <div
              className="sm:w-5/6 lg:w-3/6 md:4/6 w-full mt-8 dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">
            <InputFieldWithSuggestion
                className="min-w-full"
                title="Location Name *"
                placeholder="Select Location"
                value={locationName}
                suggestions={locations.map(location => location.location_name)} // Add your suggestions here
                onChange={(value) => setLocationName(value)}
                onValueChange={handleOnLocationChange}
                error={locationError}
            />
            <InputWithError
                className="min-w-full"
                title="Task Name *"
                placeholder="Enter Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                error={taskNameError}
            />
            <InputWithError
                className="min-w-full"
                title="Hardware"
                placeholder="Enter Hardware"
                value={hardware}
                onChange={(e) => setHardware(e.target.value)}
                error={hardwareError}
            />
            <InputWithError
                className="min-w-full"
                title="Quantity *"
                placeholder="Enter Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value.replace(/[^0-9]/g, ""))}
                error={quantityError}
            />
            <InputWithError
                className="min-w-full"
                title="Note"
                placeholder="Enter Note"
                value={note}
                onCh ange={(e) => setNote(e.target.value)}
            />

            <InputButton
                className="min-w-full"
                title="Start Date *"
                buttonTitle={startDate || 'Select Start Date'}
                onClick={(date) => {
                  setStartDate(date);
                }}
                error={startDateError}
            />

            <InputButton
                className="min-w-full"
                title="End Date *"
                buttonTitle={endDate || 'Select End Date'}
                onClick={(date) => {
                  setEndDate(date);
                  // Implement your date selection logic here
                }}
                error={endDateError}
            />
            <InputWithError
                className="min-w-full"
                title="Percentage *"
                placeholder="Enter Percentage"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                error={percentageError}
            />

            <AppDropdown
                title={"Status"}
                value={status}
                options={ProjectStatusValues}
                onSelected={(value) => setStatus(value)}/>

            <InputButton
                className="min-w-full"
                title="Actual Start Date *"
                buttonTitle={actualStartDate || 'Select Actual Start Date'}
                onClick={(date) => {
                  setActualStartDate(date);
                }}
            />

            <InputButton
                className="min-w-full"
                title="Actual End Date *"
                buttonTitle={actualEndDate || 'Select Actual End Date'}
                onClick={(date) => {
                  setActualEndDate(date);
                }}
            />

            <AppCheckBox
                value={dispatch}
                title={"Dispatch"}
                onChange={() => setDispatch(!dispatch)}
            />

            {/* Submit Button */}
            <button
                className="bg-blue-500 mt-4 min-w-full text-white py-2 px-4 rounded"
                onClick={handleSubmit}
            >
              {loading ? (
                  <ActivityIndicator size="small" color="#ffffff"/>
              ) : (
                  'Update'
              )}
            </button>
          </div>
        </div>
      </div>

  )
}

export default EditTask;