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
  FileText,
  Share2,
  BookOpen,
  Image,
  Video,
  HelpCircle,
  Star,
  Calendar,
  Newspaper
} from "lucide-react";

const Sidebar = () => {
  const { signOut, user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isSponsor = user?.role === 'sponsor';
  const isAssistant = user?.role === 'assistant';

  const hasPermission = (permission: string) => {
    if (!user?.permissions) return false;
    return user.permissions[permission] === true;
  };

  const adminLinks = [
    { to: "/dashboard", icon: Home, label: "Tableau de bord", permission: "view_dashboard" },
    { to: "/children", icon: Users, label: "Enfants", permission: "manage_children" },
    { to: "/children/add", icon: Users, label: "Ajouter un enfant", permission: "manage_children" },
    { to: "/donations", icon: Gift, label: "Dons", permission: "manage_donations" },
    { to: "/statistics", icon: BarChart, label: "Statistiques", permission: "view_analytics" },
    { to: "/media-management", icon: Camera, label: "Gestion médias", permission: "manage_media" },
    { to: "/sponsors-management", icon: UserCog, label: "Gestion parrains", permission: "manage_sponsors" },
    { to: "/messages", icon: Mail, label: "Messages", permission: "manage_messages" },
    { to: "/permissions", icon: Lock, label: "Permissions", permission: "manage_permissions" },
    { to: "/homepage-manager", icon: Image, label: "Gestion accueil", permission: "manage_homepage" },
    { to: "/testimonials-admin", icon: Star, label: "Témoignages", permission: "manage_testimonials" },
    { to: "/faq-manager", icon: HelpCircle, label: "FAQ", permission: "manage_faq" },
    { to: "/settings", icon: Settings, label: "Paramètres", permission: "manage_settings" }
  ];

  const sponsorLinks = [
    { to: "/sponsor-dashboard", icon: Home, label: "Mon tableau de bord", permission: "view_dashboard" },
    { to: "/messages", icon: MessageSquare, label: "Messages", permission: "view_messages" },
    { to: "/rewards", icon: Award, label: "Récompenses", permission: "view_rewards" },
    { to: "/my-children", icon: Heart, label: "Mes enfants parrainés", permission: "view_own_children" },
    { to: "/my-testimonials", icon: Star, label: "Mes témoignages", permission: "manage_own_testimonials" },
    { to: "/my-memories", icon: Camera, label: "Mes souvenirs", permission: "manage_own_memories" },
    { to: "/my-calendar", icon: Calendar, label: "Mon calendrier", permission: "view_calendar" },
    { to: "/share", icon: Share2, label: "Partager", permission: "share_content" }
  ];

  const assistantLinks = [
    { to: "/dashboard", icon: Home, label: "Tableau de bord", permission: "view_dashboard" },
    { to: "/children", icon: Users, label: "Enfants", permission: "manage_children" },
    { to: "/children/add", icon: Users, label: "Ajouter un enfant", permission: "manage_children" },
    { to: "/donations", icon: Gift, label: "Dons", permission: "manage_donations" },
    { to: "/messages", icon: MessageSquare, label: "Messages", permission: "view_messages" },
    { to: "/urgent-needs", icon: AlertTriangle, label: "Besoins urgents", permission: "view_urgent_needs" },
    { to: "/media-management", icon: Camera, label: "Gestion médias", permission: "manage_media" },
    { to: "/reports", icon: FileText, label: "Rapports", permission: "view_reports" },
    { to: "/news", icon: Newspaper, label: "Actualités", permission: "manage_news" }
  ];

  const renderLinks = (links: any[]) => {
    return links.map((link) => {
      if (!hasPermission(link.permission)) return null;
      
      return (
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
      );
    });
  };

  return (
    <div className="h-full px-3 py-4 flex flex-col bg-white border-r">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold">Passion Varadero</h1>
      </div>
      
      <div className="flex-1 space-y-6">
        {isAdmin && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </p>
            {renderLinks(adminLinks)}
          </div>
        )}
        
        {(isSponsor || isAdmin) && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Espace Parrain
            </p>
            {renderLinks(sponsorLinks)}
          </div>
        )}
        
        {isAssistant && !isAdmin && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Espace Assistant
            </p>
            {renderLinks(assistantLinks)}
          </div>
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