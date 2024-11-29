import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="container mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export { MainLayout };