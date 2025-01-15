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

  const publicRoutes = [
    {
      path: "/children",
      icon: Users,
      label: "Les Enfants"
    },
    {
      path: "/public-donations",
      icon: Gift,
      label: "Donations"
    },
    {
      path: "/statistics",
      icon: BarChart,
      label: "Statistiques"
    },
    {
      path: "/faq",
      icon: HelpCircle,
      label: "FAQ"
    }
  ];

  return (
    <div className={`flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 ${className}`}>
      {publicRoutes.map((route) => (
        <Button
          key={route.path}
          variant="ghost"
          onClick={() => handleNavigation(route.path)}
          className="text-primary justify-start md:justify-center"
        >
          <route.icon className="h-4 w-4 mr-2" />
          {route.label}
        </Button>
      ))}
    </div>
  );
};