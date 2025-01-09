import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Gift, Users, MessageSquare } from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";

export const Navigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSponsorClick = () => {
    navigate("/sponsor-dashboard");
  };

  const isSponsor = user?.role === 'sponsor';

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
              <Users className="h-4 w-4 mr-2" />
              Enfants disponibles
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/public-donations")}
              className="text-primary"
            >
              <Gift className="h-4 w-4 mr-2" />
              Donations
            </Button>
          </div>

          {isSponsor ? (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/messages")}
                className="text-primary"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button
                variant="ghost"
                onClick={handleSponsorClick}
                className="flex items-center gap-2 text-primary"
              >
                <User className="h-4 w-4" />
                Espace parrain
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              onClick={() => navigate("/login")}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Se connecter
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};