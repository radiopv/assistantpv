import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { LoadingScreen } from "@/components/LoadingScreen";
import MainLayout from "@/components/Layout/MainLayout";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};