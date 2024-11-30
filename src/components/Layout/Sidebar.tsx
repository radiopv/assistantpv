import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/Auth/AuthProvider";
import { 
  LayoutDashboard, 
  Users, 
  Gift, 
  MessageSquare,
  Settings,
  LogOut,
  Image,
  Award,
  Heart,
  ListChecks,
  Baby,
  UserPlus,
  Plane,
  ChartBar,
  HelpCircle,
  Cog,
  FileText,
  Home
} from "lucide-react";

const Sidebar = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isAssistant = ['admin', 'assistant'].includes(user?.role || '');

  const assistantLinks = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      show: user?.permissions?.dashboard || isAdmin,
    },
    {
      href: "/children",
      label: "Enfants",
      icon: Baby,
      show: user?.permissions?.children || isAdmin,
    },
    {
      href: "/children/needs",
      label: "Besoins",
      icon: ListChecks,
      show: user?.permissions?.children || isAdmin,
    },
    {
      href: "/children/add",
      label: "Ajouter un enfant",
      icon: UserPlus,
      show: user?.permissions?.edit_children || isAdmin,
    },
    {
      href: "/sponsorships",
      label: "Parrainages",
      icon: Heart,
      show: user?.permissions?.sponsorships || isAdmin,
    },
    {
      href: "/donations",
      label: "Dons",
      icon: Gift,
      show: user?.permissions?.donations || isAdmin,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageSquare,
      show: true,
    },
  ];

  const adminLinks = [
    {
      href: "/admin/permissions",
      label: "Permissions",
      icon: Settings,
      show: isAdmin,
    },
    {
      href: "/admin/media",
      label: "Médias",
      icon: Image,
      show: user?.permissions?.media || isAdmin,
    },
    {
      href: "/admin/sponsors",
      label: "Parrains",
      icon: Users,
      show: isAdmin,
    },
    {
      href: "/admin/home-images",
      label: "Images Accueil",
      icon: Home,
      show: isAdmin,
    },
    {
      href: "/admin/travels",
      label: "Voyages",
      icon: Plane,
      show: isAdmin,
    },
    {
      href: "/admin/statistics",
      label: "Statistiques",
      icon: ChartBar,
      show: isAdmin,
    },
    {
      href: "/admin/faq",
      label: "FAQ",
      icon: HelpCircle,
      show: isAdmin,
    },
    {
      href: "/admin/site-config",
      label: "Configuration",
      icon: Cog,
      show: isAdmin,
    },
    {
      href: "/admin/reports",
      label: "Rapports",
      icon: FileText,
      show: isAdmin,
    },
    {
      href: "/rewards",
      label: "Récompenses",
      icon: Award,
      show: isAdmin,
    },
  ];

  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="p-6">
        <Link to="/">
          <h1 className="text-xl font-bold">Passion Varadero</h1>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold text-gray-900">Assistant</h2>
            <div className="space-y-1">
              {assistantLinks.filter(link => link.show).map((link) => (
                <Link key={link.href} to={link.href}>
                  <Button
                    variant={location.pathname === link.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                      location.pathname === link.href && "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          {(isAdmin || isAssistant) && (
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold text-gray-900">Administration</h2>
              <div className="space-y-1">
                {adminLinks.filter(link => link.show).map((link) => (
                  <Link key={link.href} to={link.href}>
                    <Button
                      variant={location.pathname === link.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                        location.pathname === link.href && "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      )}
                    >
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;