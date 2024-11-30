import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthProvider";
import { 
  Home,
  Users, 
  Heart,
  Menu,
  LayoutDashboard,
  Gift,
  MessageSquare,
  History,
  HelpCircle,
  LogIn
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const PublicLayout = () => {
  const { session, user } = useAuth();

  const menuItems = [
    {
      href: "/",
      label: "Accueil",
      icon: Home,
    },
    {
      href: "/enfants-disponibles",
      label: "Enfants disponibles",
      icon: Users,
    },
    {
      href: "/devenir-parrain",
      label: "Devenir parrain",
      icon: Heart,
    },
    {
      href: "/dons",
      label: "Dons",
      icon: Gift,
    },
    {
      href: "/temoignages",
      label: "Témoignages",
      icon: MessageSquare,
    },
    {
      href: "/histoire",
      label: "Histoire",
      icon: History,
    },
    {
      href: "/faq",
      label: "FAQ",
      icon: HelpCircle,
    },
  ];

  // Vérification plus stricte pour l'accès administratif
  const isAdminOrAssistant = session && user?.role && ['admin', 'assistant'].includes(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl text-gray-900">
            Passion Varadero
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="icon" className="p-2">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-[350px] pt-16">
                <nav className="flex flex-col space-y-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-base font-medium">{item.label}</span>
                    </Link>
                  ))}
                  {isAdminOrAssistant && (
                    <Link to="/dashboard">
                      <Button className="w-full h-12 text-base">
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Administration
                      </Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="font-bold text-xl text-gray-900">
                Passion Varadero
              </Link>
              <nav className="flex items-center space-x-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Connexion</span>
                </Button>
              </Link>
              {isAdminOrAssistant && (
                <Link to="/dashboard">
                  <Button className="h-10">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Administration
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 lg:pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;