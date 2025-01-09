import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Gift,
  Settings,
  CheckSquare,
  Camera,
  Image,
  MessageSquare,
  UserCheck,
  Globe,
  FileCheck,
  BarChart2,
  Mail,
  HelpCircle,
  MapPin,
  Bell,
  Link as LinkIcon,
  LayoutDashboard
} from "lucide-react";

export const SidebarNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const adminLinks = [
    {
      href: "/admin/sponsorship-management",
      label: "Gestion des parrainages",
      icon: UserCheck,
    },
    {
      href: "/admin/translations",
      label: "Traductions",
      icon: Globe,
    },
    {
      href: "/admin/validation",
      label: "Validation",
      icon: FileCheck,
    },
    {
      href: "/admin/statistics",
      label: "Statistiques",
      icon: BarChart2,
    },
    {
      href: "/admin/emails",
      label: "Emails",
      icon: Mail,
    },
    {
      href: "/admin/faq",
      label: "FAQ",
      icon: HelpCircle,
    },
    {
      href: "/admin/cities",
      label: "Villes",
      icon: MapPin,
    },
    {
      href: "/admin/notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      href: "/admin/link-checker",
      label: "Vérification des liens",
      icon: LinkIcon,
    },
    {
      href: "/admin/home-content",
      label: "Contenu page d'accueil",
      icon: LayoutDashboard,
    },
  ];

  const sponsorLinks = [
    {
      href: "/sponsor-dashboard",
      label: t("sidebar.sponsorDashboard"),
      icon: Users,
    },
    {
      href: "/donations",
      label: t("sidebar.donations"),
      icon: Gift,
    },
    {
      href: "/settings",
      label: t("sidebar.settings"),
      icon: Settings,
    },
  ];

  const assistantLinks = [
    {
      href: "/children",
      label: t("sidebar.children"),
      icon: Users,
    },
    {
      href: "/tasks",
      label: t("sidebar.tasks"),
      icon: CheckSquare,
    },
    {
      href: "/assistant-photos",
      label: t("sidebar.photos"),
      icon: Camera,
    },
    {
      href: "/media-management",
      label: t("sidebar.mediaManagement"),
      icon: Image,
    },
    {
      href: "/messages",
      label: t("sidebar.messages"),
      icon: MessageSquare,
    },
  ];

  return (
    <nav className="space-y-4">
      {adminLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              location.pathname === link.href &&
                "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}

      <div className="my-4 h-px bg-gray-200 dark:bg-gray-800" />

      {assistantLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              location.pathname === link.href &&
                "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}

      <div className="my-4 h-px bg-gray-200 dark:bg-gray-800" />

      {sponsorLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              location.pathname === link.href &&
                "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
