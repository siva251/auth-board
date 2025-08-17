import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../store/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { token, expiry } = useSelector((s) => s.auth);

  const tokenExpiry =
    expiry || parseInt(localStorage.getItem("auth_expiry"), 10);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (tokenExpiry && Date.now() > tokenExpiry) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;