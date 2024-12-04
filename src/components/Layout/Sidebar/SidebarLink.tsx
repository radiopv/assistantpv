import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClose?: () => void;
}

export const SidebarLink = ({ 
  href, 
  label, 
  icon: Icon, 
  isActive, 
  onClose 
}: SidebarLinkProps) => {
  return (
    <Link 
      to={href}
      onClick={onClose}
    >
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start min-h-[44px]",
          isActive && "bg-primary/10"
        )}
      >
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </Button>
    </Link>
  );
};