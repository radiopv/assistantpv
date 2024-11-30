import { useTranslation } from "@/components/Translation/TranslationContext";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Gift, 
  MessageSquare,
  Image,
  Heart,
  ListChecks,
  Baby,
  UserPlus,
} from "lucide-react";

export const SidebarNavItems = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  const assistantLinks = [
    {
      href: "/dashboard",
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
      show: user?.permissions?.dashboard || user?.role === 'admin',
    },
    {
      href: "/children",
      label: t("nav.children"),
      icon: Baby,
      show: user?.permissions?.children || user?.role === 'admin',
    },
    {
      href: "/children/needs",
      label: t("nav.needs"),
      icon: ListChecks,
      show: user?.permissions?.children || user?.role === 'admin',
    },
    {
      href: "/children/add",
      label: t("nav.add_child"),
      icon: UserPlus,
      show: user?.permissions?.edit_children || user?.role === 'admin',
    },
    {
      href: "/sponsorships",
      label: t("nav.sponsorships"),
      icon: Heart,
      show: user?.permissions?.sponsorships || user?.role === 'admin',
    },
    {
      href: "/donations",
      label: t("nav.donations"),
      icon: Gift,
      show: user?.permissions?.donations || user?.role === 'admin',
    },
    {
      href: "/messages",
      label: t("nav.messages"),
      icon: MessageSquare,
      show: true,
    },
    {
      href: "/admin/media",
      label: t("nav.media"),
      icon: Image,
      show: user?.permissions?.media || user?.role === 'admin',
    },
  ];

  return (
    <div className="space-y-1">
      {assistantLinks.filter(link => link.show).map((link) => (
        <Link key={link.href} to={link.href}>
          <Button
            variant={location.pathname === link.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100",
              location.pathname === link.href && "bg-gray-100 text-gray-900 hover:bg-gray-200"
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.label}
          </Button>
        </Link>
      ))}
    </div>
  );
};