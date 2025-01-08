import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  Gift, 
  Settings, 
  CheckSquare, 
  Camera,
  MessageSquare,
  UserPlus,
  FileText,
  Map,
  Bell,
  Link as LinkIcon,
  Globe,
  BarChart2
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { isAssistant } = useAuth();

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
        <Link
          to="/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
            isActive("/dashboard") && "bg-gray-50 text-primary"
          )}
        >
          <Home className="w-5 h-5" />
          <span>Tableau de bord</span>
        </Link>

        <Link
          to="/children"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
            isActive("/children") && "bg-gray-50 text-primary"
          )}
        >
          <Users className="w-5 h-5" />
          <span>Enfants</span>
        </Link>

        <Link
          to="/donations"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
            isActive("/donations") && "bg-gray-50 text-primary"
          )}
        >
          <Gift className="w-5 h-5" />
          <span>Dons</span>
        </Link>

        <Link
          to="/messages"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
            isActive("/messages") && "bg-gray-50 text-primary"
          )}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Messages</span>
        </Link>

        <Link
          to="/tasks"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
            isActive("/tasks") && "bg-gray-50 text-primary"
          )}
        >
          <CheckSquare className="w-5 h-5" />
          <span>Tâches</span>
        </Link>

        {isAssistant && (
          <>
            <Link
              to="/assistant-photos"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                isActive("/assistant-photos") && "bg-gray-50 text-primary"
              )}
            >
              <Camera className="w-5 h-5" />
              <span>Photos</span>
            </Link>

            <Link
              to="/assistant/sponsorship"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                isActive("/assistant/sponsorship") && "bg-gray-50 text-primary"
              )}
            >
              <UserPlus className="w-5 h-5" />
              <span>Parrainages</span>
            </Link>

            <Link
              to="/admin/translations"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                isActive("/admin/translations") && "bg-gray-50 text-primary"
              )}
            >
              <Globe className="w-5 h-5" />
              <span>Traductions</span>
            </Link>

            <Link
              to="/admin/faq"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                isActive("/admin/faq") && "bg-gray-50 text-primary"
              )}
            >
              <FileText className="w-5 h-5" />
              <span>FAQ</span>
            </Link>

            <Link
              to="/admin/cities"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                isActive("/admin/cities") && "bg-gray-50 text-primary"
              )}
            >
              <Map className="w-5 h-5" />
              <span>Villes</span>
            </Link>

            <Link
              to="/admin/notifications"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                isActive("/admin/notifications") && "bg-gray-50 text-primary"
              )}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </Link>

            <Link
              to="/admin/link-checker"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                isActive("/admin/link-checker") && "bg-gray-50 text-primary"
              )}
            >
              <LinkIcon className="w-5 h-5" />
              <span>Liens</span>
            </Link>

            <Link
              to="/admin/statistics"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                isActive("/admin/statistics") && "bg-gray-50 text-primary"
              )}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Statistiques</span>
            </Link>
          </>
        )}

        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
            isActive("/settings") && "bg-gray-50 text-primary"
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Paramètres</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;