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
  BarChart,
  FileText,
  Heart,
  Video,
  HelpCircle,
  BookOpen
} from "lucide-react";

const Sidebar = () => {
  const { signOut, user, isAssistant } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isSponsor = user?.role === 'sponsor';

  const adminLinks = [
    { to: "/dashboard", icon: Home, label: "Tableau de bord" },
    { to: "/children", icon: Users, label: "Enfants" },
    { to: "/donations", icon: Gift, label: "Dons" },
    { to: "/statistics", icon: BarChart, label: "Statistiques" },
    { to: "/settings", icon: Settings, label: "Paramètres" }
  ];

  const sponsorLinks = [
    { to: "/sponsor-dashboard", icon: Home, label: "Mon tableau de bord" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/rewards", icon: Award, label: "Récompenses" },
    { to: "/my-children", icon: Heart, label: "Mes enfants parrainés" }
  ];

  const assistantLinks = [
    { to: "/dashboard", icon: Home, label: "Tableau de bord" },
    { to: "/children", icon: Users, label: "Enfants" },
    { to: "/donations", icon: Gift, label: "Dons" }
  ];

  const renderLinks = (links) => {
    return links.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive ? 'bg-gray-100 text-gray-900' : ''
          }`
        }
      >
        <link.icon className="h-4 w-4" />
        {link.label}
      </NavLink>
    ));
  };

  return (
    <div className="h-full px-3 py-4 flex flex-col bg-white border-r">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold">Passion Varadero</h1>
      </div>
      
      <div className="flex-1 space-y-1">
        {isAdmin && renderLinks(adminLinks)}
        {isSponsor && renderLinks(sponsorLinks)}
        {isAssistant && !isAdmin && renderLinks(assistantLinks)}
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