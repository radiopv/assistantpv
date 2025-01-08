import { useAuth } from "@/components/Auth/AuthProvider";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  Camera,
  UserPlus,
  Globe,
  FileText,
  Map,
  Bell,
  Link as LinkIcon,
  BarChart2
} from "lucide-react";

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavLink = ({ to, icon: Icon, label, isActive }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px]",
      isActive && "bg-gray-50 text-primary"
    )}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

export const AdminNavLinks = () => {
  const location = useLocation();
  const { isAssistant } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  // Assistant only sees photos and sponsorship management
  if (isAssistant) {
    return (
      <div className="space-y-2 border-t pt-4 mt-4">
        <NavLink to="/assistant-photos" icon={Camera} label="Photos" isActive={isActive("/assistant-photos")} />
        <NavLink to="/assistant/sponsorship" icon={UserPlus} label="Parrainages" isActive={isActive("/assistant/sponsorship")} />
      </div>
    );
  }

  // Admin sees all management options
  return (
    <div className="space-y-2 border-t pt-4 mt-4">
      <NavLink to="/assistant-photos" icon={Camera} label="Photos" isActive={isActive("/assistant-photos")} />
      <NavLink to="/assistant/sponsorship" icon={UserPlus} label="Parrainages" isActive={isActive("/assistant/sponsorship")} />
      <NavLink to="/admin/translations" icon={Globe} label="Traductions" isActive={isActive("/admin/translations")} />
      <NavLink to="/admin/faq" icon={FileText} label="FAQ" isActive={isActive("/admin/faq")} />
      <NavLink to="/admin/cities" icon={Map} label="Villes" isActive={isActive("/admin/cities")} />
      <NavLink to="/admin/notifications" icon={Bell} label="Notifications" isActive={isActive("/admin/notifications")} />
      <NavLink to="/admin/link-checker" icon={LinkIcon} label="Liens" isActive={isActive("/admin/link-checker")} />
      <NavLink to="/admin/statistics" icon={BarChart2} label="Statistiques" isActive={isActive("/admin/statistics")} />
    </div>
  );
};