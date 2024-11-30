import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";
import { UserProfileMenu } from "./UserProfileMenu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Breadcrumbs } from "./Breadcrumbs";
import { useLocation } from "react-router-dom";

const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64">
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <Breadcrumbs />
          <UserProfileMenu />
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-8">
            <div className="container mx-auto animate-fade-in">
              <Outlet />
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default MainLayout;