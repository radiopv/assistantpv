import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, HelpCircle, User, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserProfileMenu } from "@/components/Layout/UserProfileMenu";
import { useLogout } from "@/hooks/use-logout";

export const Navigation = ({ user }: { user: any }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const isAssistant = user?.role === 'assistant' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';
  const isSponsor = user?.role === 'sponsor';

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsOpen(false);
  };

  const menuItems = (
    <div className="flex flex-col space-y-4">
      <Button
        variant="ghost"
        onClick={() => {
          navigate("/children");
          setIsOpen(false);
        }}
        className="justify-start md:justify-center text-primary w-full md:w-auto"
      >
        <Heart className="h-4 w-4 mr-2" />
        {t("children")}
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

      {isAdmin && (
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/admin/home-content");
            setIsOpen(false);
          }}
          className="justify-start md:justify-center text-primary w-full md:w-auto"
        >
          <User className="h-4 w-4 mr-2" />
          Admin Page d'accueil
        </Button>
      )}
    </div>
  );

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="font-bold text-xl text-primary"
          >
            Passion Varadero
          </Button>

          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4">
                  <div className="space-y-4">{menuItems}</div>
                  <div className="border-t py-4 space-y-4">
                    {user ? (
                      <>
                        {(isSponsor || isAssistant || isAdmin) && (
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
                        )}
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
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
                        <User className="h-4 w-4 mr-2" />
                        Connexion
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {menuItems}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {(isSponsor || isAssistant || isAdmin) && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/sponsor-dashboard")}
                    className="text-primary"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Espace parrain
                  </Button>
                )}
                <UserProfileMenu />
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-primary"
              >
                <User className="h-4 w-4 mr-2" />
                Connexion
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};