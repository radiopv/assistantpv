import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  dashboard: "Tableau de bord",
  children: "Enfants",
  sponsorships: "Parrainages",
  donations: "Dons",
  messages: "Messages",
  rewards: "Récompenses",
  "admin/permissions": "Permissions",
  "admin/media": "Médias",
  "admin/sponsors": "Parrains",
  "admin/reports": "Rapports",
  "admin/faq": "FAQ",
  "admin/statistics": "Statistiques",
  "admin/site-config": "Configuration",
  "admin/travels": "Voyages",
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link
        to="/"
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const label = routeLabels[value] || value;

        return (
          <div key={to} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            {last ? (
              <span className="font-medium text-gray-900">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-primary transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};