import { useAuth } from "@/components/Auth/AuthProvider";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Gift, 
  MessageSquare,
  CheckSquare,
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

export const SidebarNavLinks = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="space-y-2">
      <NavLink to="/dashboard" icon={Home} label="Tableau de bord" isActive={isActive("/dashboard")} />
      <NavLink to="/children" icon={Users} label="Enfants" isActive={isActive("/children")} />
      <NavLink to="/donations" icon={Gift} label="Dons" isActive={isActive("/donations")} />
      <NavLink to="/messages" icon={MessageSquare} label="Messages" isActive={isActive("/messages")} />
      <NavLink to="/tasks" icon={CheckSquare} label="Tâches" isActive={isActive("/tasks")} />
    </div>
  );
};