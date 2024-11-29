import { NavLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Settings,
  UserCog,
  Gift,
  Image,
  LogOut,
} from "lucide-react";

export function AdminSidebar() {
  const { signOut, user } = useAuth();
  const isAdmin = user?.role === "admin";

  const links = [
    { to: "/admin/permissions", icon: Settings, label: "Permissions", requireAdmin: true },
    { to: "/admin/media", icon: Image, label: "Médias", permission: "media" },
    { to: "/admin/sponsors", icon: UserCog, label: "Parrains", requireAdmin: true },
    { to: "/admin/donations", icon: Gift, label: "Dons", permission: "donations" },
  ];

  const canAccessLink = (link: any) => {
    if (link.requireAdmin && !isAdmin) return false;
    if (link.permission && !user?.permissions?.[link.permission] && !isAdmin) return false;
    return true;
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 w-64 py-4 flex flex-col">
      <div className="flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Administration</h2>
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

export default AdminSidebar;