import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Globe,
  CircleDollarSign,
  Home,
} from "lucide-react";
import { SidebarSection } from "./SidebarSection";
import { useAuth } from "@/components/Auth/AuthProvider";

const adminLinks = [
  {
    href: "/admin/translations",
    label: "Traductions",
    icon: Globe,
  },
  {
    href: "/admin/statistics",
    label: "Statistiques",
    icon: CircleDollarSign,
  },
  {
    href: "/admin/home-content",
    label: "Page d'accueil",
    icon: Home,
  },
];

const settingsLinks = [
  {
    href: "/settings",
    label: "Paramètres",
    icon: Settings,
  },
];

export const SidebarNav = ({ onClose }: { onClose?: () => void }) => {
  const { user, isAssistant } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col gap-4">
      {user && isAssistant && (
        <>
          <SidebarSection
            title="Administration"
            links={adminLinks}
            currentPath={location.pathname}
            onClose={onClose}
          />
          <SidebarSection
            title="Paramètres"
            links={settingsLinks}
            currentPath={location.pathname}
            onClose={onClose}
          />
        </>
      )}
    </div>
  );
};