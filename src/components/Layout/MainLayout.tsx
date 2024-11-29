import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";

const MainLayout = () => {
  const { user, isAdmin, isAssistant } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to frontend if not admin or assistant
  if (!isAdmin && !isAssistant) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-64 fixed h-full">
          <Sidebar />
        </div>
        <main className="flex-1 ml-64 p-8 overflow-auto">
          <div className="container mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export { MainLayout };