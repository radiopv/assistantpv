import { NavLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Heart,
  Gift,
  UserCog,
  Settings,
  LogOut,
  Image,
  MessageSquare,
} from "lucide-react";

export function Sidebar() {
  const { signOut, user } = useAuth();

  const isAdmin = user?.role === "admin";

  const links = [
    { to: "/", icon: Home, label: "Tableau de bord", permission: "dashboard" },
    { to: "/children", icon: Users, label: "Enfants", permission: "children" },
    {
      to: "/sponsorships",
      icon: Heart,
      label: "Parrainages",
      permission: "sponsorships",
    },
    {
      to: "/donations",
      icon: Gift,
      label: "Dons",
      permission: "donations",
    },
    {
      to: "/messages",
      icon: MessageSquare,
      label: "Messages",
      permission: null,
    },
  ];

  const adminLinks = [
    {
      to: "/admin/permissions",
      icon: Settings,
      label: "Permissions",
      requireAdmin: true,
    },
    {
      to: "/admin/media",
      icon: Image,
      label: "Médias",
      permission: "media",
    },
    {
      to: "/admin/sponsors",
      icon: UserCog,
      label: "Parrains",
      requireAdmin: true,
    },
  ];

  const canAccessLink = (link: any) => {
    if (link.requireAdmin && !isAdmin) return false;
    if (link.permission && !user?.permissions?.[link.permission] && !isAdmin)
      return false;
    return true;
  };

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
          <div className="space-y-1">
            {links.map((link) =>
              canAccessLink(link) ? (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                      isActive &&
                        "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
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
        {(isAdmin || adminLinks.some(canAccessLink)) && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Administration</h2>
            <div className="space-y-1">
              {adminLinks.map((link) =>
                canAccessLink(link) ? (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                        isActive &&
                          "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
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
        )}
        <div className="px-3 py-2">
          <div className="space-y-1">
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
      </div>
    </div>
  );
}

export default Sidebar;