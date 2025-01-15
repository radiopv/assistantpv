import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Gift, Users, HelpCircle, BarChart, LogIn, LogOut, Home, Menu, Heart } from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { UserProfileMenu } from "@/components/Layout/UserProfileMenu";
import { toast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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

  const MenuItems = () => (
    <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
      {isAssistant && (
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/");
            setIsOpen(false);
          }}
          className="justify-start md:justify-center text-primary w-full md:w-auto"
        >
          <Home className="h-4 w-4 mr-2" />
          Accueil
        </Button>
      )}

      <Button
        variant="ghost"
        onClick={() => {
          navigate("/available-children");
          setIsOpen(false);
        }}
        className="justify-start md:justify-center text-primary w-full md:w-auto"
      >
        <Users className="h-4 w-4 mr-2" />
        Enfants disponibles
      </Button>

      <Button
        variant="ghost"
        onClick={() => {
          navigate("/sponsored-children");
          setIsOpen(false);
        }}
        className="justify-start md:justify-center text-primary w-full md:w-auto"
      >
        <Heart className="h-4 w-4 mr-2" />
        Enfants parrainés
      </Button>

      <Button
        variant="ghost"
        onClick={() => {
          navigate("/public-donations");
          setIsOpen(false);
        }}
        className="justify-start md:justify-center text-primary w-full md:w-auto"
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
        className="justify-start md:justify-center text-primary w-full md:w-auto"
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
        className="justify-start md:justify-center text-primary w-full md:w-auto"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        FAQ
      </Button>
    </div>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] sm:w-[385px] bg-white">
                <div className="flex flex-col h-full">
                  <div className="flex-1 py-6 space-y-4">
                    <MenuItems />
                  </div>
                  <div className="border-t py-4 space-y-4">
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
            <MenuItems />
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
    </nav>
  );
};