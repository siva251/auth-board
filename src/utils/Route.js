import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Lazy load all components
const UsersPage = lazy(() => import("../pages/UsersPage"));
const UserFormPage = lazy(() => import("../pages/UserFormPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes = {
  public: [
    { path: "/login", element: <LoginPage /> },
  ],
  private: [
    { path: "/", element: <Navigate to="/users" /> },
    { path: "/users", element: <UsersPage /> },
    { path: "/create", element: <UserFormPage /> },
    { path: "/edit/:id", element: <UserFormPage /> },
  ],
  notFound: { path: "*", element: <NotFound /> },
};