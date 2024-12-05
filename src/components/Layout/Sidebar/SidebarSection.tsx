import { cn } from "@/lib/utils";
import { SidebarLink } from "./SidebarLink";
import { LucideIcon } from "lucide-react";

interface SidebarLinkType {
  href: string;
  label: string;
  icon: LucideIcon;
  show: boolean;
  subItems?: SidebarLinkType[];
}

interface SidebarSectionProps {
  title: string;
  links: SidebarLinkType[];
  currentPath: string;
  onClose?: () => void;
  className?: string;
}

export const SidebarSection = ({ 
  title, 
  links, 
  currentPath, 
  onClose,
  className 
}: SidebarSectionProps) => {
  return (
    <div className={cn("px-3 py-2", className)}>
      <h2 className="mb-2 px-4 text-lg font-semibold">{title}</h2>
      <div className="space-y-1">
        {links.filter(link => link.show).map((link) => (
          <div key={link.href}>
            <SidebarLink
              href={link.href}
              label={link.label}
              icon={link.icon}
              isActive={currentPath === link.href}
              onClose={onClose}
            />
            {link.subItems && link.subItems.filter(subItem => subItem.show).map((subItem) => (
              <SidebarLink
                key={subItem.href}
                href={subItem.href}
                label={subItem.label}
                icon={subItem.icon}
                isActive={currentPath === subItem.href}
                onClose={onClose}
                className="pl-8"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};