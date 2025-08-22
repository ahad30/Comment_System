import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout/DashboardLayout";
import MainLayout from "../components/layouts/MainLayout/MainLayout";
import HomePage from "../Pages/Home/HomePage";
import AboutPage from "../Pages/About/AboutPage";
import ErrorPage from "../components/common/ErrorPage/ErrorPage";
import Login from "@/Pages/Login/Login";
import Register from "@/Pages/Register/Register";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard/admin",
        element: <div>Admin</div>,
      },
    ],
  },
]);
