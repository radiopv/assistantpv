import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthProvider";
import { 
  LayoutDashboard, 
  Menu,
  Users,
  Gift,
  HelpCircle,
  User
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";

const PublicLayout = () => {
  const { session, user } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    {
      href: "/",
      label: t("home"),
      icon: LayoutDashboard,
    },
    {
      href: "/available-children",
      label: t("childrenWaitingSponsorship"),
      icon: Users,
    },
    {
      href: "/public-donations",
      label: t("donations"),
      icon: Gift,
    },
    {
      href: "/faq",
      label: t("faq"),
      icon: HelpCircle,
    }
  ];

  const isAdmin = user?.role === 'admin';
  const isAssistant = user?.role === 'assistant';
  const isSponsor = user?.role === 'sponsor' || (isAdmin && user?.children_sponsored?.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">
            Passion Varadero
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:w-[350px] lg:hidden">
              <div className="flex flex-col space-y-4 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                {session ? (
                  <div className="space-y-2">
                    {(isAdmin || isAssistant) && (
                      <Link to="/dashboard">
                        <Button className="w-full">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          {t("dashboard")}
                        </Button>
                      </Link>
                    )}
                    {isSponsor && (
                      <Link to="/sponsor-dashboard">
                        <Button className="w-full">
                          <User className="mr-2 h-4 w-4" />
                          {t("profile")}
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <Link to="/login">
                    <Button className="w-full">{t("login")}</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="font-bold text-xl">
                Passion Varadero
              </Link>
              <nav className="flex items-center space-x-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  {(isAdmin || isAssistant) && (
                    <Link to="/dashboard">
                      <Button>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t("dashboard")}
                      </Button>
                    </Link>
                  )}
                  {isSponsor && (
                    <Link to="/sponsor-dashboard">
                      <Button>
                        <User className="mr-2 h-4 w-4" />
                        {t("profile")}
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <Link to="/login">
                  <Button>{t("login")}</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 lg:pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;