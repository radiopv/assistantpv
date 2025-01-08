import { Link } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNavLinks } from "./Sidebar/SidebarNavLinks";
import { AdminNavLinks } from "./Sidebar/AdminNavLinks";

const Sidebar = () => {
  const { isAssistant } = useAuth();

  return (
    <div className="h-full bg-white border-r flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-semibold text-xl">Passion Varadero</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <SidebarNavLinks />
        
        {/* Settings always at the bottom */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 md:relative md:border-0 md:p-0 md:mt-auto">
          {/* Admin/Assistant menu */}
          <AdminNavLinks />
          
          {/* Settings link */}
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors mt-4",
            )}
          >
            <Settings className="w-5 h-5" />
            <span>Paramètres</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;