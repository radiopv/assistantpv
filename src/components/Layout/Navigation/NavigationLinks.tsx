import { NavLink } from "react-router-dom";

interface NavigationLink {
  to: string;
  icon: React.ComponentType;
  label: string;
}

interface NavigationLinksProps {
  links: NavigationLink[];
}

export const NavigationLinks = ({ links }: NavigationLinksProps) => {
  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
              isActive ? 'bg-gray-100 text-gray-900' : ''
            }`
          }
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </NavLink>
      ))}
    </>
  );
};