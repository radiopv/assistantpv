import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
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
  CircleDollarSign,
  User,
} from "lucide-react";
import { SidebarSection } from "./SidebarSection";
import { useAuth } from "@/components/Auth/AuthProvider";

const publicLinks = [
  {
    href: "/",
    label: "Accueil",
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
    href: "/sponsor-dashboard",
    label: "Espace parrain",
    icon: User,
  },
  {
    href: "/faq",
    label: "FAQ",
    icon: FileText,
  },
];

const sponsorLinks = [
  {
    href: "/sponsor-dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  {
    href: "/messages",
    label: "Messages",
    icon: MessageSquare,
  },
];

const assistantLinks = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
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
    show: true,
  },
];

const adminLinks = [
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
    href: "/admin/statistics",
    label: "Statistiques",
    icon: CircleDollarSign,
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
      <SidebarSection
        title="Navigation"
        links={publicLinks}
        currentPath={location.pathname}
        onClose={onClose}
      />

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
            <>
              <SidebarSection
                title="Espace assistant"
                links={assistantLinks}
                currentPath={location.pathname}
                onClose={onClose}
              />
              <SidebarSection
                title="Administration"
                links={adminLinks}
                currentPath={location.pathname}
                onClose={onClose}
              />
            </>
          )}

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