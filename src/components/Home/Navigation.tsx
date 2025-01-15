import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { UserProfileMenu } from "@/components/Layout/UserProfileMenu";
import { toast } from "@/components/ui/use-toast";
import { MobilePublicMenu } from "@/components/Navigation/MobilePublicMenu";
import { DesktopPublicMenu } from "@/components/Navigation/DesktopPublicMenu";
import { MobileAdminMenu } from "@/components/Navigation/MobileAdminMenu";

export const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut, isAssistant } = useAuth();

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
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Menu Hamburger Mobile */}
          <MobilePublicMenu />

          {/* Menu Public Desktop */}
          <DesktopPublicMenu />

          {/* Boutons de droite - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/sponsor-dashboard")}
                  className="text-primary"
                >
                  <User className="h-4 w-4 mr-2" />
                  Espace parrain
                </Button>
                <UserProfileMenu />
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

      {/* Menu Admin Mobile (Barre du bas) */}
      <MobileAdminMenu isAssistant={isAssistant} />
    </nav>
  );
};