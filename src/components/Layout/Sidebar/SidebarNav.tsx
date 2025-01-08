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

const sponsorLinks = [
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
    href: "/assistant-sponsorship",
    label: "Parrainages",
    icon: UserPlus,
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
    href: "/assistant-sponsorship",
    label: "Parrainages",
    icon: UserPlus,
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
];

const adminLinks = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/sponsorship-management",
    label: "Gestion des parrainages",
    icon: UserPlus,
  },
  {
    href: "/admin/emails",
    label: "Emails",
    icon: Mail,
  },
  {
    href: "/admin/translations",
    label: "Traductions",
    icon: Languages,
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/admin/faq",
    label: "FAQ",
    icon: FileText,
  },
  {
    href: "/admin/home-content-management",
    label: "Contenu accueil",
    icon: Home,
  },
  {
    href: "/admin/link-checker",
    label: "Vérificateur de liens",
    icon: LinkIcon,
  },
  {
    href: "/admin/validation",
    label: "Validation",
    icon: AlertTriangle,
  },
  {
    href: "/settings",
    label: "Paramètres",
    icon: Settings,
  },
];

export const SidebarNav = () => {
  const { t } = useLanguage();

  return (
    <nav className="space-y-2 px-4">
      {sponsorLinks.map((link) => (
        <SidebarLink key={link.href} {...link} />
      ))}
      {assistantLinks.map((link) => (
        <SidebarLink key={link.href} {...link} />
      ))}
      {adminLinks.map((link) => (
        <SidebarLink key={link.href} {...link} />
      ))}
    </nav>
  );
};
