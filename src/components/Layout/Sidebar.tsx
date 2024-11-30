import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Heart, Home, Users, Gift, PiggyBank, 
  MessageSquare, Medal, Settings, FileText, 
  BarChart3, Map, FileImage, UserCog, ChevronRight 
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

// Grouper les liens administratifs par catégorie
const adminLinks = {
  gestion: [
    { to: "/admin/permissions", icon: UserCog, label: "Permissions" },
    { to: "/admin/sponsors", icon: Users, label: "Parrains" },
    { to: "/admin/media", icon: FileImage, label: "Médias" },
  ],
  contenu: [
    { to: "/admin/faq", icon: ChevronRight, label: "FAQ" },
    { to: "/admin/reports", icon: FileText, label: "Rapports" },
    { to: "/admin/travels", icon: Map, label: "Voyages" },
  ],
  systeme: [
    { to: "/admin/statistics", icon: BarChart3, label: "Statistiques" },
    { to: "/admin/site-config", icon: Settings, label: "Configuration" },
  ],
};

// Liens principaux
const mainLinks = [
  { to: "/dashboard", icon: Home, label: "Tableau de bord" },
  { to: "/children", icon: Users, label: "Enfants", permission: "children" },
  { to: "/sponsorships", icon: Heart, label: "Parrainages", permission: "sponsorships" },
  { to: "/donations", icon: PiggyBank, label: "Dons", permission: "donations" },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
  { to: "/rewards", icon: Medal, label: "Récompenses" },
];

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();

  const renderNavLink = (to: string, icon: any, label: string) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        cn(
          "text-sm group flex p-2.5 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
          "md:p-3",
          isActive && "text-primary bg-primary/10"
        )
      }
    >
      {React.createElement(icon, { className: "h-5 w-5 mr-3" })}
      <span className="truncate">{label}</span>
    </NavLink>
  );

  return (
    <div className={cn("pb-12", className)}>
      <ScrollArea className="h-full px-3 py-2">
        <div className="space-y-4">
          {/* Liens principaux */}
          <div className="space-y-1">
            {mainLinks.map(
              ({ to, icon, label, permission }) =>
                (!permission ||
                  user?.permissions?.[permission] ||
                  user?.role === "admin") &&
                renderNavLink(to, icon, label)
            )}
          </div>

          {/* Section Admin */}
          {user?.role === "admin" && (
            <>
              {Object.entries(adminLinks).map(([category, links]) => (
                <div key={category} className="space-y-1">
                  <h2 className="mb-2 px-2 text-sm font-semibold tracking-tight text-muted-foreground">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h2>
                  {links.map(({ to, icon, label }) => renderNavLink(to, icon, label))}
                </div>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default Sidebar;