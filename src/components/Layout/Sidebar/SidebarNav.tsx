import { useLocation } from "react-router-dom";
import {
  Users,
  Settings,
  Gift,
  Home,
  FileText,
  Bell,
  Mail,
  ClipboardList,
} from "lucide-react";
import { SidebarLink } from "./SidebarLink";
import { useAuth } from "@/components/Auth/AuthProvider";

const adminLinks = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: Home,
  },
  {
    href: "/admin/children-management",
    label: "Gestion Enfants",
    icon: Users,
  },
  {
    href: "/admin/sponsorship-management",
    label: "Gestion Parrainages",
    icon: Users,
  },
  {
    href: "/admin/donations-management",
    label: "Gestion Donations",
    icon: Gift,
  },
  {
    href: "/admin/home-content",
    label: "Page d'accueil",
    icon: Home,
  },
  {
    href: "/admin/emails",
    label: "Emails",
    icon: Mail,
  },
  {
    href: "/admin/faq",
    label: "FAQ Admin",
    icon: FileText,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
];

const sponsorLinks = [
  {
    href: "/sponsor-dashboard",
    label: "Tableau de bord",
    icon: Home,
  },
  {
    href: "/available-children",
    label: "Enfants disponibles",
    icon: Users,
  },
  {
    href: "/public-donations",
    label: "Dons",
    icon: Gift,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/faq",
    label: "FAQ",
    icon: FileText,
  },
];

export const SidebarNav = ({ onClose }: { onClose?: () => void }) => {
  const { user, isAssistant } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col gap-2 p-2">
      {user && (
        <>
          {!isAssistant && (
            <div className="space-y-1">
              {sponsorLinks.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  isActive={location.pathname === link.href}
                  onClose={onClose}
                />
              ))}
            </div>
          )}

          {isAssistant && (
            <div className="space-y-1">
              {adminLinks.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  isActive={location.pathname === link.href}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};