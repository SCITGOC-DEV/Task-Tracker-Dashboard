import React, {useEffect, useState} from "react";
import {useStateContext} from "../contexts/ContextProvider";
import {Header} from "../components";
import {Link, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {useLazyQuery, useMutation} from "@apollo/client";
import useAuth from "../hooks/useAuth";
import {ActivityIndicator} from "react-native-web";
import {InputWithError} from "../components/InputWithError";
import {InputFieldWithSuggestion} from "../components/TextFieldWithSuggestions";
import {AppConstants} from "../utils/Constants";
import {
  ADD_PROJECT_INVENTORY,
  GET_INVENTORY_DATA_BY_SCIT,
  GET_PROJECT_NAMES
} from "../graphql/query/projectInventoryQueries";
import PageRoutes from "../utils/PageRoutes";
import {InputButton} from "../components/InnputButton";
import {GET_LOCATIONS, GET_TASK_BY_ID, UPDATE_TASK_BY_ID} from "../graphql/query/getAllTasks";
import {AppCheckBox} from "../components/AppCheckBox";
import {ADD_TASK} from "../graphql/mutation/addTask";
import {ProjectStatusValues} from "../utils/ProjectStatus";

const EditTask = () => {
  const {currentColor} = useStateContext();
  const navigate = useNavigate()
  const {role} = useAuth()
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());

  const today = new Date().toISOString();

  // State management
  const [locationName, setLocationName] = useState('');
  const [project, setProject] = useState('');
  const [projectId, setProjectId] = useState('')
  const [taskName, setTaskName] = useState('');
  const [hardware, setHardware] = useState('');
  const [percentage, setPercentage] = useState(0)
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
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
  const [dispatch, setDispatch] = useState(false);

  const [getTaskById] = useLazyQuery(GET_TASK_BY_ID, {
    onCompleted: data => {
      const task = data.tasks[0];
      setLocationName(task.fk_location_name || '');
      setProject(task.project?.project_name || '');
      setProjectId(task.project?.id || '');
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
      variables: {id: id}
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
    if (!project) {
      setProjectError('Project is required.');
      isValid = false;
    }
    if (!taskName) {
      setTaskNameError('Task Name is required.');
      isValid = false;
    }
    if (!hardware) {
      setHardwareError('Hardware is required.');
      isValid = false;
    }
    if (!quantity) {
      setQuantityError('Quantity is required.');
      isValid = false;
    }
    if (!percentage) {
      setPercentageError('Percentage is required.');
      isValid = false;
    }
    if (!startDate) {
      setStartDateError('Start Date is required.');
      isValid = false;
    }
    if (!endDate) {
      setEndDateError('End Date is required.');
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
    onCompleted: data => {
      setTimeout(() => {
        setLoading(false)
        toast.success("Updated task successfully")
        navigate(PageRoutes.Tasks)
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
      const variables = {
        id: id,
        locationName: locationName,
        projectId: projectId,
        hardware: hardware,
        note: note,
        percentage: percentage,
        taskName: taskName,
        quantity: quantity,
        startDateTime: startDate,
        endDateTime: endDate,
        dispatch: dispatch,
        status: status
      }
      console.log(variables)
      updateTask({
        variables: variables
      })
    }
  };

  const handleOnProjectChange = (query) => {
    console.log(query);
    getProjectNames({
      variables: {query: `${query}%`}
    })
    setProject(query)
  }

  const handleOnLocationChange = (query) => {
    getLocations({
      variables: {query: `${query}%`}
    })
  }

  return (

      <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white ">
        <Header title={"Update Task"} category="Pages"/>
        <Link
            to={PageRoutes.Tasks}
            className="inline-block p-2 px-4 rounded-lg mb-4 text-white hover:opacity-95"
            style={{background: currentColor}}
        >
          Back
        </Link>

        <div className="w-full flex flex-col justify-center items-center">
          <div
              className="sm:w-5/6 lg:w-3/6 md:4/6 w-full dark:bg-box-dark-bg border bg-white flex flex-col gap-4 dark:shadow-sm shadow-md sm:p-10 p-5 rounded-lg">
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
            <InputFieldWithSuggestion
                className="min-w-full"
                title="Project *"
                placeholder="Select Project"
                value={project}
                suggestions={projectNames.map(project => project.project_name)} // Add your suggestions here
                onChange={(value) => {
                  const project = projectNames.find(pj => pj.project_name == value)
                  setProjectId(project?.id)
                  setProject(value)
                }}
                onValueChange={handleOnProjectChange}
                error={projectError}
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
                title="Hardware *"
                placeholder="Enter Hardware"
                value={hardware}
                onChange={(e) => setHardware(e.target.value)}
                error={hardwareError}
            />
            <InputWithError
                className="min-w-full"
                title="Percentage *"
                placeholder="Enter Percentage"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                error={percentageError}
            />
            <InputFieldWithSuggestion
                className="min-w-full"
                title="Status"
                placeholder="Enter status"
                value={status}
                suggestions={ProjectStatusValues}
                onChange={(e) => setStatus(e)}
                error={""}
            />
            <InputWithError
                className="min-w-full"
                title="Quantity *"
                placeholder="Enter Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={quantityError}
            />
            <InputWithError
                className="min-w-full"
                title="Note"
                placeholder="Enter Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
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