import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";

export const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};