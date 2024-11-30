import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Users, 
  Heart, 
  Gift, 
  MessageSquare,
  UserCog,
  FileImage,
  FileText,
  BarChart3,
  HelpCircle,
  Settings,
  Plane
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const mainLinks = [
    { to: "/dashboard", icon: Home, label: "Tableau de bord", permission: "dashboard" },
    { to: "/children", icon: Users, label: "Enfants", permission: "children" },
    { to: "/sponsorships", icon: Heart, label: "Parrainages", permission: "sponsorships" },
    { to: "/donations", icon: Gift, label: "Dons", permission: "donations" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
  ];

  const adminLinks = [
    { to: "/admin/permissions", icon: UserCog, label: "Permissions" },
    { to: "/admin/media", icon: FileImage, label: "Médias", permission: "media" },
    { to: "/admin/reports", icon: FileText, label: "Rapports" },
    { to: "/admin/faq", icon: HelpCircle, label: "FAQ" },
    { to: "/admin/statistics", icon: BarChart3, label: "Statistiques" },
    { to: "/admin/site-config", icon: Settings, label: "Configuration" },
    { to: "/admin/travels", icon: Plane, label: "Voyages" },
  ];

  const renderNavLink = ({ to, icon: Icon, label, permission }: { to: string, icon: any, label: string, permission?: string }) => {
    // Si l'utilisateur n'a pas la permission et n'est pas admin, ne pas afficher le lien
    if (permission && !user?.permissions?.[permission] && !isAdmin) {
      return null;
    }

    return (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          cn(
            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
            isActive && "text-primary bg-primary/10"
          )
        }
      >
        <Icon className="h-5 w-5 mr-3" />
        {label}
      </NavLink>
    );
  };

  return (
    <div className={cn("pb-12 h-full bg-white border-r", className)}>
      <div className="space-y-4 py-4 h-full">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            Passion Varadero
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              {mainLinks.map(renderNavLink)}
            </div>

            {isAdmin && (
              <div className="mt-6">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Administration
                </h2>
                <div className="space-y-1">
                  {adminLinks.map(renderNavLink)}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;