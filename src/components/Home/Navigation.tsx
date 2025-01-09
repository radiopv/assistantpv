import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Gift, Users, MessageSquare, LayoutDashboard, Image, FileText } from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";

export const Navigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAssistant = user?.role === 'assistant' || user?.role === 'admin';

  const handleSponsorClick = () => {
    navigate("/sponsor-dashboard");
  };

  const isSponsor = user?.role === 'sponsor';

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {isAssistant ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="text-primary"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Tableau de bord
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/children")}
                  className="text-primary"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Enfants
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/assistant-photos")}
                  className="text-primary"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Photos
                </Button>
              </>
            ) : (
              <>
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
                <Button
                  variant="ghost"
                  onClick={() => navigate("/faq")}
                  className="text-primary"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  FAQ
                </Button>
              </>
            )}
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
          ) : !isAssistant && (
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