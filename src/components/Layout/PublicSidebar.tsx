import { NavLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Heart,
  LogOut,
  MessageSquare,
} from "lucide-react";

export function PublicSidebar() {
  const { signOut, user } = useAuth();

  const links = [
    { to: "/", icon: Home, label: "Tableau de bord", permission: "dashboard" },
    { to: "/children", icon: Users, label: "Enfants", permission: "children" },
    { to: "/sponsorships", icon: Heart, label: "Parrainages", permission: "sponsorships" },
    { to: "/messages", icon: MessageSquare, label: "Messages", permission: null },
  ];

  const canAccessLink = (link: any) => {
    if (link.permission && !user?.permissions?.[link.permission]) return false;
    return true;
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 w-64 py-4 flex flex-col">
      <div className="flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
          <div className="space-y-1">
            {links.map((link) =>
              canAccessLink(link) ? (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                      isActive && "bg-gray-100 text-gray-900"
                    )
                  }
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              ) : null
            )}
          </div>
        </div>
      </div>

      <div className="px-3 py-2 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}

export default PublicSidebar;