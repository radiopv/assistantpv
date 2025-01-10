import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Gift, Users, MessageSquare, LayoutDashboard, HelpCircle, BarChart, LogIn, LogOut, Home } from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { UserProfileMenu } from "@/components/Layout/UserProfileMenu";
import { toast } from "@/components/ui/use-toast";

export const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isAssistant = user?.role === 'assistant' || user?.role === 'admin';
  const isSponsor = user?.role === 'sponsor';

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {/* Home Link - Always visible */}
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-primary"
            >
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Button>

            {/* Public Menu Items - Always visible */}
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
              onClick={() => navigate("/statistics")}
              className="text-primary"
            >
              <BarChart className="h-4 w-4 mr-2" />
              Statistiques
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/faq")}
              className="text-primary"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </Button>

            {/* Assistant/Admin Menu Items */}
            {isAssistant && (
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-primary"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Tableau de bord
              </Button>
            )}
          </div>

          {/* Right side menu items */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Show Sponsor Dashboard link for all connected users */}
                <Button
                  variant="ghost"
                  onClick={() => navigate("/sponsor-dashboard")}
                  className="text-primary"
                >
                  <User className="h-4 w-4 mr-2" />
                  Espace parrain
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/messages")}
                  className="text-primary"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </Button>
                <UserProfileMenu />
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-primary"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-primary"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};