import { ReactNode } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";

const MainLayout = () => {
  const { user, isAdmin, isAssistant } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Vérification des permissions basée sur le chemin
  const path = location.pathname;
  if (path.startsWith('/admin') && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (path.startsWith('/assistant') && !isAssistant && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (path.startsWith('/sponsor') && user.role !== 'sponsor' && !isAdmin) {
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