import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";

interface MainLayoutProps {
  children?: ReactNode;
  requireAdmin?: boolean;
  requireAssistant?: boolean;
}

const MainLayout = ({ children, requireAdmin, requireAssistant }: MainLayoutProps) => {
  const { user, isAdmin, isAssistant } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireAssistant && !isAssistant && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-64 fixed h-full">
          <Sidebar />
        </div>
        <main className="flex-1 ml-64 p-8 overflow-auto">
          <div className="container mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export { MainLayout };