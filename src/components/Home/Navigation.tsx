import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();

  const handleSponsorClick = () => {
    navigate("/sponsor-dashboard");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/available-children")}
              className="text-primary"
            >
              Enfants disponibles
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/donations")}
              className="text-primary"
            >
              Donations
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={handleSponsorClick}
            className="flex items-center gap-2 text-primary"
          >
            <User className="h-4 w-4" />
            Espace parrain
          </Button>
        </div>
      </div>
    </nav>
  );
};