import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Gift,
  Settings,
  MessageSquare,
  CheckSquare,
  UserPlus,
  Mail,
  Globe,
  FileText,
  Home,
  Image,
  AlertTriangle,
  Link as LinkIcon,
  Languages,
  Bell,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/Auth/AuthProvider";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
}

const SidebarLink = ({ href, label, icon: Icon, end }: SidebarLinkProps) => (
  <NavLink
    to={href}
    end={end}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
        "hover:bg-cuba-warmBeige",
        isActive && "bg-cuba-warmBeige text-primary font-medium"
      )
    }
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </NavLink>
);

export const SidebarNav = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isAssistant = user?.role === 'assistant';
  const isSponsor = user?.role === 'sponsor';

  const commonLinks = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
      show: true,
    },
    {
      href: "/children",
      label: "Enfants",
      icon: Users,
      show: true,
    },
    {
      href: "/donations",
      label: "Dons",
      icon: Gift,
      show: true,
    },
  ];

  const sponsorLinks = [
    {
      href: "/messages",
      label: "Messages",
      icon: MessageSquare,
      show: isSponsor,
    },
    {
      href: "/tasks",
      label: "Tâches",
      icon: CheckSquare,
      show: isSponsor,
    },
  ];

  const assistantLinks = [
    {
      href: "/assistant-photos",
      label: "Photos",
      icon: Image,
      show: isAssistant,
    },
    {
      href: "/assistant-sponsorship",
      label: "Parrainages",
      icon: UserPlus,
      show: isAssistant,
    },
  ];

  const adminLinks = [
    {
      href: "/admin/sponsorship-management",
      label: "Gestion des parrainages",
      icon: UserPlus,
      show: isAdmin,
    },
    {
      href: "/admin/emails",
      label: "Emails",
      icon: Mail,
      show: isAdmin,
    },
    {
      href: "/admin/translations",
      label: "Traductions",
      icon: Languages,
      show: isAdmin,
    },
    {
      href: "/admin/notifications",
      label: "Notifications",
      icon: Bell,
      show: isAdmin,
    },
    {
      href: "/admin/faq",
      label: "FAQ",
      icon: FileText,
      show: isAdmin,
    },
    {
      href: "/admin/home-content-management",
      label: "Contenu accueil",
      icon: Home,
      show: isAdmin,
    },
    {
      href: "/admin/link-checker",
      label: "Vérificateur de liens",
      icon: LinkIcon,
      show: isAdmin,
    },
    {
      href: "/admin/validation",
      label: "Validation",
      icon: AlertTriangle,
      show: isAdmin,
    },
    {
      href: "/settings",
      label: "Paramètres",
      icon: Settings,
      show: isAdmin,
    },
  ];

  const allLinks = [...commonLinks, ...sponsorLinks, ...assistantLinks, ...adminLinks].filter(link => link.show);

  return (
    <nav className="space-y-2 px-4">
      {allLinks.map((link) => (
        <SidebarLink key={link.href} {...link} />
      ))}
    </nav>
  );
};