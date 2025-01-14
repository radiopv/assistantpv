import { useLocation } from "react-router-dom";
import {
  Users,
  Settings,
  Gift,
  Home,
  MessageSquare,
  FileText,
  Bell,
  Mail,
  ClipboardList,
} from "lucide-react";
import { SidebarLink } from "./SidebarLink";
import { useAuth } from "@/components/Auth/AuthProvider";

const adminLinks = [
  {
    href: "/admin/children-management",
    label: "Parrainage/Enfant",
    icon: Users,
  },
  {
    href: "/admin/donations-management",
    label: "Donations",
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
    label: "FAQ",
    icon: FileText,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    href: "/settings",
    label: "Paramètres",
    icon: Settings,
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
    href: "/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    href: "/faq",
    label: "FAQ",
    icon: FileText,
  },
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