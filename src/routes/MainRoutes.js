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
import AddInventoryHistory from "../pages/inventory_history/AddInventoryHistory";
import { InventoryHistory } from "../pages/inventory_history/InventoryHistory";
import { InventoryCategories } from "../pages/InventoryCategories";
import ProjectAdminHome from "../pages/project-admin/ProjectAdminHome";
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


const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/project-admin",
      element: <ProjectAdminHome />,
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
      path: "/tasks",
      element: <Task />,
    },
    {
      path: "/tasks/add",
      element: <AddTask />,
    },
    {
      path: "/tasks/edit-task/:id",
      element: <EditTask />,
    },
    {
      path: PageRoutes.TaskInventory,
      element: <TaskInventory />,
    },
    {
      path: PageRoutes.AddTaskInventory,
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
      path: PageRoutes.InventoryRecords,
      element: <InventoryRecords/>
    },
    {
      path: PageRoutes.InventoryHistory,
      element: <InventoryHistory/>
    },
    {
      path: PageRoutes.AddInventoryHistory,
      element: <AddInventoryHistory/>
    },
    {
      path: PageRoutes.Projects,
      element: <Projects/>
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
      path: PageRoutes.AddProjectInventory,
      element: <AddProjectInventory/>
    },
    {
      path: PageRoutes.EditProjectInventory,
      element: <EditProjectInventory/>
    }
  ],
};

export default MainRoutes;
