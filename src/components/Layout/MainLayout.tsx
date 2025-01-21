import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Navigation } from "@/components/Home/Navigation";

const MainLayout = () => {
  const { user, isAssistant } = useAuth();
  const showSidebar = isAssistant;

  return (
    <div className="min-h-screen bg-cuba-offwhite flex flex-col">
      {/* Top Navigation for all users - Now sticky */}
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <Navigation />
      </div>

      <div className="flex-1 flex">
        {showSidebar && (
          <>
            {/* Desktop Sidebar - Always visible */}
            <div className="hidden md:block w-64 fixed h-full">
              <Sidebar />
            </div>
          </>
        )}

        <main className={`flex-1 ${showSidebar ? 'md:ml-64' : ''} pb-16 md:pb-0`}>
          <div className="p-4 md:p-8">
            <div className="container mx-auto animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;