import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  FileText,
  Map,
  Bell,
  Link as LinkIcon,
  Globe,
  BarChart2
} from "lucide-react";

interface AdminMenuProps {
  isActive: (path: string) => boolean;
}

export const AdminMenu = ({ isActive }: AdminMenuProps) => {
  return (
    <>
      <Link
        to="/admin/translations"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
          isActive("/admin/translations") && "bg-gray-50 text-primary"
        )}
      >
        <Globe className="w-5 h-5" />
        <span>Traductions</span>
      </Link>

      <Link
        to="/admin/faq"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
          isActive("/admin/faq") && "bg-gray-50 text-primary"
        )}
      >
        <FileText className="w-5 h-5" />
        <span>FAQ</span>
      </Link>

      <Link
        to="/admin/cities"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
          isActive("/admin/cities") && "bg-gray-50 text-primary"
        )}
      >
        <Map className="w-5 h-5" />
        <span>Villes</span>
      </Link>

      <Link
        to="/admin/notifications"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
          isActive("/admin/notifications") && "bg-gray-50 text-primary"
        )}
      >
        <Bell className="w-5 h-5" />
        <span>Notifications</span>
      </Link>

      <Link
        to="/admin/link-checker"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
          isActive("/admin/link-checker") && "bg-gray-50 text-primary"
        )}
      >
        <LinkIcon className="w-5 h-5" />
        <span>Liens</span>
      </Link>

      <Link
        to="/admin/statistics"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
          isActive("/admin/statistics") && "bg-gray-50 text-primary"
        )}
      >
        <BarChart2 className="w-5 h-5" />
        <span>Statistiques</span>
      </Link>
    </>
  );
};