// src/components/common/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../fx/Loader";

// Requires any logged-in user. Redirects to /login, remembering where
// they were headed so we could send them back after login if desired.
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Session restore is quick, but a blank frame here reads as a broken app.
  if (loading) return <Loader label="Restoring your session" full />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;