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

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
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
  ],
};

export default MainRoutes;
