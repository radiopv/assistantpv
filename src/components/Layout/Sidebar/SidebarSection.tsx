import { cn } from "@/lib/utils";
import { SidebarLink } from "./SidebarLink";
import { LucideIcon } from "lucide-react";

interface SidebarLinkType {
  href: string;
  label: string;
  icon: LucideIcon;
  show: boolean;
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
          <SidebarLink
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            isActive={currentPath === link.href}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
};