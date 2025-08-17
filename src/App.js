import { Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import loadingGif from "./Assets/loadingGif.gif";
import { routes } from "./utils/Route";
import ThemeToggle from "./components/ThemeToggle";


const RestrictedRoute = ({ isPrivate, redirectTo }) => {
 const { user } = useSelector((state) => state.auth);
 const shouldRedirect = isPrivate ? !user : user;
 // If 'shouldRedirect' is true, it sends the user to the specified path. Otherwise, it renders the child components (the nested <Route>s) for the current path.
 return shouldRedirect ? <Navigate to={redirectTo} /> : <Outlet />;
};

const App = () => {
 const { isDarkMode } = useSelector((state) => state.theme);
 console.log("skk...isDarkMode",isDarkMode)
return( <>
<div className={isDarkMode ? "dark" : ""}>
<div className={`min-h-screen bg-gray-100 dark:bg-gray-900 `}>
 <ThemeToggle/>
  <Suspense fallback={<img src={loadingGif} alt="Loading..." style={{ width: "50px", height: "50px" }} />}>
   <Routes>
    <Route element={<RestrictedRoute isPrivate={false} redirectTo="/users" />}>
     {routes.public.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
     ))}
    </Route>
    <Route element={<RestrictedRoute isPrivate={true} redirectTo="/login" />}>
     {routes.private.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
     ))}
    </Route>
    <Route path={routes.notFound.path} element={routes.notFound.element} />
   </Routes>
  </Suspense>
  <ToastContainer />
  </div>
</div>
 </>)
};

export default App;