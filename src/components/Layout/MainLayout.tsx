import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";

const MainLayout = () => {
  const { session } = useAuth();

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-0 md:pl-64 min-h-screen">
        <div className="container py-8 px-4 md:px-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;