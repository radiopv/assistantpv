import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect sponsors to their dashboard, others to home
    if (user.role === 'sponsor') {
      return <Navigate to="/sponsor/dashboard" />;
    }
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;