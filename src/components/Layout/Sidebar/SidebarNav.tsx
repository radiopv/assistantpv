import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users,
  Gift,
  Settings,
  CheckSquare,
  Camera,
  MessageSquare,
  UserPlus,
  FileText,
  Map,
  Bell,
  Link as LinkIcon,
  Globe,
  BarChart2
} from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon: Icon, label, isActive }: NavItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
      isActive && "bg-gray-50 text-primary"
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export const SidebarNav = () => {
  const { user } = useAuth();
  const isAssistant = user?.role === 'assistant';
  const isAdmin = user?.role === 'admin';

  const commonMenuItems = [
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

  const assistantMenuItems = [
    {
      href: "/assistant-photos",
      label: "Photos",
      icon: Camera,
    },
    {
      href: "/assistant/sponsorship",
      label: "Parrainages",
      icon: UserPlus,
    },
    {
      href: "/admin/sponsorship-management",
      label: "Gestion des parrainages",
      icon: UserPlus,
    },
  ];

  const adminMenuItems = [
    {
      href: "/admin/translations",
      label: "Traductions",
      icon: Globe,
    },
    {
      href: "/admin/faq",
      label: "FAQ",
      icon: FileText,
    },
    {
      href: "/admin/cities",
      label: "Villes",
      icon: Map,
    },
    {
      href: "/admin/notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      href: "/admin/link-checker",
      label: "Liens",
      icon: LinkIcon,
    },
    {
      href: "/admin/statistics",
      label: "Statistiques",
      icon: BarChart2,
    },
  ];

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex-1 space-y-1 px-2">
      <div className="space-y-1">
        {commonMenuItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.href)}
          />
        ))}
      </div>

      {isAssistant && (
        <div className="mt-8 space-y-1">
          <h3 className="px-3 text-sm font-medium text-gray-500">Assistant</h3>
          {assistantMenuItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="mt-8 space-y-1">
          <h3 className="px-3 text-sm font-medium text-gray-500">Admin</h3>
          {adminMenuItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      )}

      <div className="mt-8">
        <NavItem
          href="/settings"
          icon={Settings}
          label="Paramètres"
          isActive={isActive("/settings")}
        />
      </div>
    </nav>
  );
};