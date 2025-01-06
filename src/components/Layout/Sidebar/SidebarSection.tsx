import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { SidebarLink } from "./SidebarLink";

interface SidebarSectionProps {
  title: string;
  links: Array<{
    href: string;
    label: string;
    icon: LucideIcon;
    show?: boolean;
    subItems?: Array<{
      href: string;
      label: string;
      icon: LucideIcon;
      show?: boolean;
    }>;
  }>;
  currentPath: string;
  onClose?: () => void;
}

export const SidebarSection = ({ 
  title, 
  links, 
  currentPath,
  onClose 
}: SidebarSectionProps) => {
  const visibleLinks = links.filter(link => link.show !== false);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="px-3 text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <div className="space-y-1 p-2">
        {visibleLinks.map((link) => (
          <div key={link.href}>
            <SidebarLink
              href={link.href}
              label={link.label}
              icon={link.icon}
              isActive={currentPath === link.href}
              onClose={onClose}
            />
            {link.subItems?.filter(subItem => subItem.show !== false).map((subItem) => (
              <SidebarLink
                key={subItem.href}
                href={subItem.href}
                label={subItem.label}
                icon={subItem.icon}
                isActive={currentPath === subItem.href}
                onClose={onClose}
                className="ml-4"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};