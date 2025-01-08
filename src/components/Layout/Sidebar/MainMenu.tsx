import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  Gift, 
  Settings,
  CheckSquare,
  MessageSquare,
} from "lucide-react";

interface MainMenuProps {
  isActive: (path: string) => boolean;
}

export const MainMenu = ({ isActive }: MainMenuProps) => {
  return (
    <>
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
    </>
  );
};