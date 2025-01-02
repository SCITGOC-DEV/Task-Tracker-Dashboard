import MainLayout from "../layout/MainLayout";
import {
  AddLocation,
  AddTask,
  AddUser,
  ChangeAdminPassword,
  ChangeUserPassword,
  Dashboard,
  EditAdmin,
  EditLocation,
  EditTask,
  EditUser,
  Locations,
  Profile,
  Task,
  TrackingDetail,
  TrackingTask,
  User,
} from "../pages";
import AddInventoryCategory from "../pages/AddInventoryCategory";
import UpdateInventoryCategory from "../pages/EditInventoryCategory";
import AddInventory from "../pages/inventory/AddInventory";
import { InventoryRecords } from "../pages/inventory/InventoryRecords";
import AddInventoryToTask from "../pages/inventory_to_task/AddInventoryToTask";
import { InventoryToTask } from "../pages/inventory_to_task/InventoryToTask";
import { InventoryCategories } from "../pages/InventoryCategories";
import ProjectAdmins from "../pages/project-admin/ProjectAdmins";
import AddProject from "../pages/project/AddProject";
import { Projects } from "../pages/project/Projects";
import PageRoutes from "../utils/PageRoutes";
import Routes from "../utils/PageRoutes";
import UpdateProject from "../pages/project/UpdateProject";
import {ProjectInventory} from "../pages/project-inventory/ProjectInventory";
import AddProjectInventory from "../pages/project-inventory/AddProjectInventory";
import EditProjectInventory from "../pages/project-inventory/EditProjectInventory";
import {TaskInventory} from "../pages/task-inventory/TaskInventory";
import AddTaskInventory from "../pages/task-inventory/AddTaskInventory";
import EditTaskInventory from "../pages/task-inventory/EditTaskInventory";
import UpdateInventory from "../pages/inventory/UpdateInventory";
import ProjectDetails from "../pages/project/ProjectDetails";
import TaskDetails from "../pages/project/tasks/TaskDetails";
import InventoryDetails from "../pages/inventory/InventoryDetails";
import ProjectInventoryDetails from "../pages/project-inventory/ProjectInventoryDetails";
import TaskInventoryDetails from "../pages/task-inventory/TaskInventoryDetails";
import ReturnProjectInventory from "../pages/project-inventory/ReturnProjectInventory";
import PendingInventories from "../pages/pending-inventories/PendingInventories";
import AddProjectAdmin from "../pages/project-admin/AddProjectAdmin";
import UpdateProjectAdmin from "../pages/project-admin/UpdateProjectAdmin";
import RequestedTaskInventories from "../pages/pending-inventories/RequestedTaskInventories";


const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: PageRoutes.ProjectAdmins,
      element: <ProjectAdmins />,
    },
    {
      path: PageRoutes.AddProjectAdmins,
      element: <AddProjectAdmin />,
    },
    {
      path: PageRoutes.EditProjectAdmins,
      element: <UpdateProjectAdmin />,
    },
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/users",
      element: <User />,
    },
    {
      path: "/users/add",
      element: <AddUser />,
    },
    {
      path: "/users/change-password/:id",
      element: <ChangeUserPassword />,
    },
    {
      path: PageRoutes.Tasks,
      element: <Task />,
    },
    {
      path: PageRoutes.TaskDetails,
      element: <TaskDetails />,
    },
    {
      path: PageRoutes.AddTask,
      element: <AddTask />,
    },
    {
      path: PageRoutes.EditTask,
      element: <EditTask />,
    },
    {
      path: PageRoutes.TaskInventory,
      element: <TaskInventory />,
    },
    {
      path: `${PageRoutes.AddTaskInventory}/:id/:taskId`,
      element: <AddTaskInventory />,
    },

    {
      path: PageRoutes.EditTaskInventory,
      element: <EditTaskInventory />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/profile/change-password",
      element: <ChangeAdminPassword />,
    },
    {
      path: "/profile/edit-admin",
      element: <EditAdmin />,
    },
    {
      path: "/users/edit-user/:id",
      element: <EditUser />,
    },
    {
      path: "/locations",
      element: <Locations />,
    },
    {
      path: "/locations/add",
      element: <AddLocation />,
    },
    {
      path: "/locations/edit-location/:id",
      element: <EditLocation />,
    },
    {
      path: "/trackings",
      element: <TrackingTask />,
    },
    {
      path: PageRoutes.TaskDetailsMain,
      element: <TaskDetails/>,
    },
    {
      path: "/trackings/:id",
      element: <TrackingDetail />,
    },
    {
      path: "/inventory-categories",
      element: <InventoryCategories/>
    },
    {
      path: PageRoutes.AddInventoryCategory,
      element: <AddInventoryCategory/>
    },
    {
      path: PageRoutes.EditInventoryCategory,
      element: <UpdateInventoryCategory/>
    },
    {
      path: PageRoutes.AddInventory,
      element: <AddInventory/>
    },
    {
      path: PageRoutes.AddInventoryMain,
      element: <AddInventory/>
    },
    {
      path: `${PageRoutes.InventoryDetails}/:id`,
      element: <InventoryDetails/>
    },

    {
      path: PageRoutes.InventoryDetailsMain,
      element: <InventoryDetails/>
    },
    {
      path: PageRoutes.ProjectInventoryDetails,
      element: <ProjectInventoryDetails/>
    },
    {
      path: PageRoutes.InventoryRecords,
      element: <InventoryRecords/>
    },
    {
      path: PageRoutes.UpdateInventory,
      element: <UpdateInventory/>
    },
    {
      path: PageRoutes.UpdateInventoryMain,
      element: <UpdateInventory/>
    },
    {
      path: PageRoutes.InventoryToTask,
      element: <InventoryToTask/>
    },
    {
      path: PageRoutes.AddInventoryToTask,
      element: <AddInventoryToTask/>
    },

    {
      path: PageRoutes.TaskInventoryDetails,
      element: <TaskInventoryDetails/>
    },
    {
      path: PageRoutes.Projects,
      element: <Projects/>
    },
    {
      path: PageRoutes.ProjectDetails,
      element: <ProjectDetails/>
    },
    {
      path: PageRoutes.AddProject,
      element: <AddProject/>
    },
    {
      path: PageRoutes.EditProject,
      element: <UpdateProject/>
    },
    {
      path: PageRoutes.ProjectInventory,
      element: <ProjectInventory/>
    },
    {
      path: PageRoutes.ReturnProjectInventory,
      element: <ReturnProjectInventory/>
    },
    {
      path: PageRoutes.AddProjectInventory,
      element: <AddProjectInventory/>
    },
    {
      path: PageRoutes.EditProjectInventory,
      element: <EditProjectInventory/>
    },
    {
      path: PageRoutes.PendingInventories,
      element: <PendingInventories/>
    },
    {
      path: PageRoutes.RequestedInventories,
      element: <RequestedTaskInventories/>
    },
  ],
};

export default MainRoutes;
