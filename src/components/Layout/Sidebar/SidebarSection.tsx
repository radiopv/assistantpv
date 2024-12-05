import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Gift,
  Settings,
  MessageSquare,
  FileText,
  Home,
  Globe,
  Camera,
  Calendar
} from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

const SidebarLink = ({ href, icon: Icon, label, isActive }: SidebarLinkProps) => (
  <Link to={href}>
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  </Link>
);

export const SidebarSection = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAssistant } = useAuth();

  const adminLinks = [
    {
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      label: t('dashboard')
    },
    {
      href: '/admin/sponsors',
      icon: Users,
      label: t('sponsors')
    },
    {
      href: '/admin/donations',
      icon: Gift,
      label: t('donations')
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: t('settings')
    },
    {
      href: '/admin/messages',
      icon: MessageSquare,
      label: t('messages')
    },
    {
      href: '/admin/documents',
      icon: FileText,
      label: t('documents')
    },
    {
      href: '/admin/home-modules',
      icon: LayoutDashboard,
      label: t('Page d\'accueil')
    }
  ];

  const assistantLinks = [
    {
      href: '/',
      icon: Home,
      label: t('home')
    },
    {
      href: '/visits',
      icon: Calendar,
      label: t('visits')
    },
    {
      href: '/media',
      icon: Camera,
      label: t('media')
    },
    {
      href: '/translations',
      icon: Globe,
      label: t('translations')
    }
  ];

  const links = isAssistant ? assistantLinks : adminLinks;

  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <SidebarLink
          key={link.href}
          {...link}
          isActive={location.pathname === link.href}
        />
      ))}
    </div>
  );
};