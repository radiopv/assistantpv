import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";
import { UserProfileMenu } from "./UserProfileMenu";
import { MessageNotification } from "@/components/Messages/MessageNotification";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSponsorDashboardClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/sponsor-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block w-64 fixed h-full">
        <Sidebar />
      </div>

      <main className="flex-1 md:ml-64 pb-16 md:pb-0">
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleSponsorDashboardClick}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Espace parrain
          </Button>
          <div className="flex items-center gap-4">
            <MessageNotification />
            <UserProfileMenu />
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div className="container mx-auto animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;