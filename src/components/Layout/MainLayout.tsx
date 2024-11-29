import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";

const MainLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64 p-8">
        <div className="container mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;