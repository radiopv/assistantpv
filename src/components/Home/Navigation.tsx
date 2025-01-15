import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Users,
  Settings,
  Gift,
  Home,
  FileText,
  Bell,
  Mail,
  User,
  LogIn,
  LogOut,
  HelpCircle,
  BarChart,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { UserProfileMenu } from "@/components/Layout/UserProfileMenu";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut, isAssistant } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

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

  // Public menu items
  const PublicMenuItems = () => (
    <div className="flex flex-col space-y-2">
      <Button
        variant="ghost"
        onClick={() => {
          navigate("/children");
          setIsOpen(false);
        }}
        className="justify-start text-primary w-full"
      >
        <Users className="h-4 w-4 mr-2" />
        Les Enfants
      </Button>

      <Button
        variant="ghost"
        onClick={() => {
          navigate("/public-donations");
          setIsOpen(false);
        }}
        className="justify-start text-primary w-full"
      >
        <Gift className="h-4 w-4 mr-2" />
        Donations
      </Button>

      <Button
        variant="ghost"
        onClick={() => {
          navigate("/statistics");
          setIsOpen(false);
        }}
        className="justify-start text-primary w-full"
      >
        <BarChart className="h-4 w-4 mr-2" />
        Statistiques
      </Button>

      <Button
        variant="ghost"
        onClick={() => {
          navigate("/faq");
          setIsOpen(false);
        }}
        className="justify-start text-primary w-full"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        FAQ
      </Button>
    </div>
  );

  // Admin menu items (bottom bar)
  const AdminMenuItems = () => (
    isAssistant && (
      <div className="fixed bottom-0 left-0 right-0 bg-cuba-coral/90 backdrop-blur-sm border-t border-cuba-coral/20 px-2 py-1 md:hidden">
        <div className="flex justify-around items-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-white hover:text-white/80"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Accueil</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/admin/children-management")}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-white hover:text-white/80"
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Enfants</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/admin/donations-management")}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-white hover:text-white/80"
          >
            <Gift className="h-5 w-5" />
            <span className="text-xs mt-1">Dons</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/notifications")}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-white hover:text-white/80"
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs mt-1">Notifs</span>
          </Button>
        </div>
      </div>
    )
  );

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Hamburger Menu (Public Links) */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-cuba-warmBeige/10 transition-colors"
                >
                  <Menu className="h-6 w-6 text-cuba-coral" />
                  <span className="sr-only">Menu public</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-[80%] sm:w-[385px] bg-white/95 backdrop-blur-sm border-cuba-coral/20"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1 py-6">
                    <PublicMenuItems />
                  </div>
                  <div className="border-t border-cuba-coral/10 py-4">
                    {user ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            navigate("/sponsor-dashboard");
                            setIsOpen(false);
                          }}
                          className="justify-start text-primary w-full"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Espace parrain
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="justify-start text-primary w-full"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Déconnexion
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/login");
                          setIsOpen(false);
                        }}
                        className="justify-start text-primary w-full"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Connexion
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 space-x-4">
            <PublicMenuItems />
          </div>

          {/* Right side menu items - Desktop */}
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

      {/* Mobile Admin Menu (Bottom Bar) */}
      <AdminMenuItems />
    </nav>
  );
};