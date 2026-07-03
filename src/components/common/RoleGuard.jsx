// src/components/common/RoleGuard.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Restricts a route subtree to specific roles. Use nested inside ProtectedRoute
// so `user` is guaranteed to exist by the time this checks the role.
const RoleGuard = ({ allow = [] }) => {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;