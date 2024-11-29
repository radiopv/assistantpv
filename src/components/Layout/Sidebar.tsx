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
  Heart,
  Camera,
  Database,
  UserCog,
  Mail,
  AlertTriangle,
  Lock,
  Layout,
  Star,
  HelpCircle,
  Calendar,
  Share2,
  FileText,
  Newspaper
} from "lucide-react";

const Sidebar = () => {
  const { signOut, user, isAssistant } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isSponsor = user?.role === 'sponsor';

  const adminLinks = [
    { to: "/dashboard", icon: Home, label: "Tableau de bord" },
    { to: "/children", icon: Users, label: "Enfants" },
    { to: "/children/add", icon: Users, label: "Ajouter un enfant" },
    { to: "/donations", icon: Gift, label: "Dons" },
    { to: "/statistics", icon: BarChart, label: "Statistiques" },
    { to: "/media-management", icon: Camera, label: "Gestion médias" },
    { to: "/sponsors-management", icon: UserCog, label: "Gestion parrains" },
    { to: "/messages", icon: Mail, label: "Messages" },
    { to: "/homepage-management", icon: Layout, label: "Gestion accueil" },
    { to: "/testimonials-management", icon: Star, label: "Gestion témoignages" },
    { to: "/faq-management", icon: HelpCircle, label: "Gestion FAQ" },
    { to: "/permissions", icon: Lock, label: "Permissions" },
    { to: "/settings", icon: Settings, label: "Paramètres" }
  ];

  const sponsorLinks = [
    { to: "/sponsor-dashboard", icon: Home, label: "Mon tableau de bord" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/rewards", icon: Award, label: "Récompenses" },
    { to: "/my-children", icon: Heart, label: "Mes enfants parrainés" },
    { to: "/my-testimonials", icon: Star, label: "Mes témoignages" },
    { to: "/my-memories", icon: Camera, label: "Mes souvenirs" },
    { to: "/my-calendar", icon: Calendar, label: "Mon calendrier" },
    { to: "/share", icon: Share2, label: "Partager" }
  ];

  const assistantLinks = [
    { to: "/dashboard", icon: Home, label: "Tableau de bord" },
    { to: "/children", icon: Users, label: "Enfants" },
    { to: "/children/add", icon: Users, label: "Ajouter un enfant" },
    { to: "/donations", icon: Gift, label: "Dons" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/urgent-needs", icon: AlertTriangle, label: "Besoins urgents" },
    { to: "/media-management", icon: Camera, label: "Gestion médias" },
    { to: "/reports", icon: FileText, label: "Rapports" },
    { to: "/news", icon: Newspaper, label: "Actualités" }
  ];

  const renderLinks = (links) => {
    return links.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive ? 'bg-gray-100 text-gray-900 rounded-lg' : ''
          }`
        }
      >
        <link.icon className="h-4 w-4" />
        <span className="text-sm font-medium">{link.label}</span>
      </NavLink>
    ));
  };

  return (
    <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold text-gray-900">Passion Varadero</h1>
      </div>
      
      <nav className="space-y-6">
        {isAdmin && (
          <div className="space-y-1">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </p>
            {renderLinks(adminLinks)}
          </div>
        )}
        
        {isSponsor && (
          <div className="space-y-1">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Espace Parrain
            </p>
            {renderLinks(sponsorLinks)}
          </div>
        )}
        
        {isAssistant && !isAdmin && (
          <div className="space-y-1">
            <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Espace Assistant
            </p>
            {renderLinks(assistantLinks)}
          </div>
        )}
      </nav>

      <div className="border-t mt-6 pt-6">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:text-gray-900"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
};

export { Sidebar };