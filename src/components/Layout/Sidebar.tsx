import { NavLink } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Gift, 
  LogOut, 
  Settings,
  Award,
  MessageSquare,
  BarChart
} from "lucide-react";

const Sidebar = () => {
  const { signOut, user, isAssistant } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isSponsor = user?.role === 'sponsor';

  return (
    <div className="h-full px-3 py-4 flex flex-col bg-white border-r">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold">Passion Varadero</h1>
      </div>
      
      <div className="flex-1 space-y-1">
        {/* Admin/Assistant Links */}
        {(isAdmin || isAssistant) && (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
                  isActive ? 'bg-gray-100 text-gray-900' : ''
                }`
              }
            >
              <Home className="h-4 w-4" />
              Tableau de bord
            </NavLink>
            <NavLink
              to="/children"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
                  isActive ? 'bg-gray-100 text-gray-900' : ''
                }`
              }
            >
              <Users className="h-4 w-4" />
              Enfants
            </NavLink>
            <NavLink
              to="/donations"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
                  isActive ? 'bg-gray-100 text-gray-900' : ''
                }`
              }
            >
              <Gift className="h-4 w-4" />
              Dons
            </NavLink>
          </>
        )}

        {/* Sponsor Links */}
        {isSponsor && (
          <>
            <NavLink
              to="/sponsor-dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
                  isActive ? 'bg-gray-100 text-gray-900' : ''
                }`
              }
            >
              <Home className="h-4 w-4" />
              Mon tableau de bord
            </NavLink>
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
                  isActive ? 'bg-gray-100 text-gray-900' : ''
                }`
              }
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </NavLink>
            <NavLink
              to="/rewards"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
                  isActive ? 'bg-gray-100 text-gray-900' : ''
                }`
              }
            >
              <Award className="h-4 w-4" />
              Récompenses
            </NavLink>
            <NavLink
              to="/statistics"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
                  isActive ? 'bg-gray-100 text-gray-900' : ''
                }`
              }
            >
              <BarChart className="h-4 w-4" />
              Statistiques
            </NavLink>
          </>
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export { Sidebar };