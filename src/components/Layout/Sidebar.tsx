import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { cn } from "@/lib/utils";
import { MainMenu } from "./Sidebar/MainMenu";
import { AssistantMenu } from "./Sidebar/AssistantMenu";
import { AdminMenu } from "./Sidebar/AdminMenu";

const Sidebar = () => {
  const location = useLocation();
  const { isAssistant, isAdmin } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full bg-white border-r flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-semibold text-xl">Passion Varadero</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <MainMenu isActive={isActive} />
        
        {/* Assistant Menu */}
        {isAssistant && (
          <div className="pt-4 mt-4 border-t">
            <h3 className="px-3 mb-2 text-sm font-medium text-gray-500">Menu Assistant</h3>
            <AssistantMenu isActive={isActive} />
          </div>
        )}

        {/* Admin Menu */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t">
            <h3 className="px-3 mb-2 text-sm font-medium text-gray-500">Menu Admin</h3>
            <AdminMenu isActive={isActive} />
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;