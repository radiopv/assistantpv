import { useLocation } from "react-router-dom";
import {
  Users,
  Settings,
  Gift,
  Home,
  Image,
  MessageSquare,
  FileText,
  CheckSquare,
  Globe,
  Bell,
  Link,
  Mail,
  Building2,
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
    href: "/donations",
    label: "Dons",
    icon: Gift,
  },
  {
    href: "/admin/translations",
    label: "Traductions",
    icon: Globe,
  },
  {
    href: "/admin/validation",
    label: "Validation",
    icon: CheckSquare,
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
    href: "/admin/cities",
    label: "Villes",
    icon: Building2,
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/admin/link-checker",
    label: "Vérification des liens",
    icon: Link,
  },
  {
    href: "/admin/audit-logs",
    label: "Historique des modifications",
    icon: ClipboardList,
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
    href: "/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    href: "/tasks",
    label: "Tâches",
    icon: CheckSquare,
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
