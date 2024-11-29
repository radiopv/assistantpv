import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationLink {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface NavigationLinksProps {
  links: NavigationLink[];
}

export const NavigationLinks = ({ links }: NavigationLinksProps) => {
  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              isActive && "bg-gray-100 text-gray-900 font-medium"
            )
          }
        >
          {link.icon && (
            <link.icon
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            />
          )}
          <span className="truncate">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};