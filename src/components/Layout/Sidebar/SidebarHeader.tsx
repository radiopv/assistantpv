import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SidebarHeaderProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export const SidebarHeader = ({ onClose, isMobile }: SidebarHeaderProps) => {
  return (
    <div className="p-6 flex justify-between items-center">
      <Link to="/" onClick={onClose}>
        <h1 className="text-xl font-bold">Passion Varadero</h1>
      </Link>
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};