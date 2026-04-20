import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ProtectedRoute = ({ allowRoles }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowRoles && !allowRoles.includes(currentUser.user_type_id)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
