import { Button } from "@/components/ui/button";
import { Users, Gift, BarChart, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PublicMenuItemsProps {
  onItemClick?: () => void;
  className?: string;
}

export const PublicMenuItems = ({ onItemClick, className = "" }: PublicMenuItemsProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onItemClick) onItemClick();
  };

  return (
    <div className={`flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 ${className}`}>
      <Button
        variant="ghost"
        onClick={() => handleNavigation("/children")}
        className="text-primary justify-start md:justify-center"
      >
        <Users className="h-4 w-4 mr-2" />
        Les Enfants
      </Button>

      <Button
        variant="ghost"
        onClick={() => handleNavigation("/public-donations")}
        className="text-primary justify-start md:justify-center"
      >
        <Gift className="h-4 w-4 mr-2" />
        Donations
      </Button>

      <Button
        variant="ghost"
        onClick={() => handleNavigation("/statistics")}
        className="text-primary justify-start md:justify-center"
      >
        <BarChart className="h-4 w-4 mr-2" />
        Statistiques
      </Button>

      <Button
        variant="ghost"
        onClick={() => handleNavigation("/faq")}
        className="text-primary justify-start md:justify-center"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        FAQ
      </Button>
    </div>
  );
};