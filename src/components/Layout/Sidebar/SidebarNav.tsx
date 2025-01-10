import { useLocation } from "react-router-dom";
import {
  Users,
  Settings,
  Gift,
  Home,
  UserPlus,
  Image,
  MessageSquare,
  FileText,
  CheckSquare,
  Globe,
  Bell,
  Link,
  Mail,
  Building2,
} from "lucide-react";
import { SidebarSection } from "./SidebarSection";
import { useAuth } from "@/components/Auth/AuthProvider";

const adminLinks = [
  {
    href: "/children",
    label: "Enfants",
    icon: Users,
  },
  {
    href: "/donations",
    label: "Dons",
    icon: Gift,
  },
  {
    href: "/assistant-photos",
    label: "Photos",
    icon: Image,
  },
  {
    href: "/admin/sponsorship-management",
    label: "Gestion des parrainages",
    icon: UserPlus,
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
    <div className="flex flex-col gap-4">
      {user && (
        <>
          {!isAssistant && (
            <SidebarSection
              title="Espace parrain"
              links={sponsorLinks}
              currentPath={location.pathname}
              onClose={onClose}
            />
          )}

          {isAssistant && (
            <SidebarSection
              title="Administration"
              links={adminLinks}
              currentPath={location.pathname}
              onClose={onClose}
            />
          )}
        </>
      )}
    </div>
  );
};
