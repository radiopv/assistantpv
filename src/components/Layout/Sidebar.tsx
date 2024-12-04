import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/Auth/AuthProvider";
import { 
  LayoutDashboard, 
  Users, 
  Gift, 
  MessageSquare,
  Settings,
  Image,
  Baby,
  UserPlus,
  Plane,
  ChartBar,
  HelpCircle,
} from "lucide-react";
import { SidebarHeader } from "./Sidebar/SidebarHeader";
import { SidebarSection } from "./Sidebar/SidebarSection";
import { SidebarFooter } from "./Sidebar/SidebarFooter";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isMobile, onClose }: SidebarProps) => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

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
      href: "/children/add",
      label: "Ajouter un enfant",
      icon: UserPlus,
      show: user?.permissions?.edit_children || isAdmin,
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
  ];

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-white",
      isMobile && "relative"
    )}>
      <SidebarHeader isMobile={isMobile} onClose={onClose} />
      
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <SidebarSection
            title="Assistant"
            links={assistantLinks}
            currentPath={location.pathname}
            onClose={onClose}
          />
          
          {isAdmin && (
            <SidebarSection
              title="Administration"
              links={adminLinks}
              currentPath={location.pathname}
              onClose={onClose}
            />
          )}
        </div>
      </ScrollArea>

      <SidebarFooter onSignOut={signOut} onClose={onClose} />
    </div>
  );
};

export default Sidebar;