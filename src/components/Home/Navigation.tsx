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

const publicLinks = [
  {
    href: "/",
    label: "Index",
    icon: Home,
  },
  {
    href: "/children",
    label: "Les Enfants",
    icon: Users,
  },
  {
    href: "/public-donations",
    label: "Donations",
    icon: Gift,
  },
  {
    href: "/statistics",
    label: "Statistiques",
    icon: BarChart,
  },
  {
    href: "/faq",
    label: "FAQ",
    icon: HelpCircle,
  },
];

const adminLinks = [
  {
    href: "/admin/children-management",
    label: "Gestion Enfants",
    icon: Users,
  },
  {
    href: "/admin/donations-management",
    label: "Gestion Donations",
    icon: Gift,
  },
  {
    href: "/admin/home-content",
    label: "Page d'accueil",
    icon: Home,
  },
  {
    href: "/admin/emails",
    label: "Emails",
    icon: Mail,
  },
  {
    href: "/admin/faq",
    label: "FAQ Admin",
    icon: FileText,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
];

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

  const MenuItems = () => (
    <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
      {publicLinks.map((link) => (
        <Button
          key={link.href}
          variant="ghost"
          onClick={() => {
            navigate(link.href);
            setIsOpen(false);
          }}
          className="justify-start md:justify-center text-primary w-full md:w-auto"
        >
          <link.icon className="h-4 w-4 mr-2" />
          {link.label}
        </Button>
      ))}
    </div>
  );

  const AdminMenuItems = () => (
    <div className="md:hidden border-t mt-4 pt-4">
      <p className="text-sm font-semibold text-gray-500 mb-2 px-2">Menu Administrateur</p>
      <div className="flex flex-col space-y-2">
        {adminLinks.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            onClick={() => {
              navigate(link.href);
              setIsOpen(false);
            }}
            className="justify-start text-primary w-full"
          >
            <link.icon className="h-4 w-4 mr-2" />
            {link.label}
          </Button>
        ))}
      </div>
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
                  <div className="flex-1 py-6">
                    <MenuItems />
                    {isAssistant && <AdminMenuItems />}
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