import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { SidebarLink } from "./SidebarLink";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={title} className="border-none">
        <AccordionTrigger className="px-3 py-2 text-lg font-semibold tracking-tight hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent>
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};