import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthProvider";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Menu, LayoutDashboard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const PublicLayout = () => {
  const { session, user } = useAuth();
  const isLoginPage = window.location.pathname === '/login';

  const menuItems = [
    {
      href: "/",
      label: "Accueil",
      icon: LayoutDashboard,
    },
  ];

  const isAdminOrAssistant = user?.role === 'admin' || user?.role === 'assistant';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">
            Passion Varadero
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 mt-8">
                  {!isLoginPage && menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  {session ? (
                    isAdminOrAssistant ? (
                      <Link to="/dashboard">
                        <Button className="w-full">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Administration
                        </Button>
                      </Link>
                    ) : null
                  ) : (
                    !isLoginPage && (
                      <Link to="/login">
                        <Button className="w-full">Administration</Button>
                      </Link>
                    )
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
              {!isLoginPage && (
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
              )}
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              {session ? (
                isAdminOrAssistant ? (
                  <Link to="/dashboard">
                    <Button>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Administration
                    </Button>
                  </Link>
                ) : null
              ) : (
                !isLoginPage && (
                  <Link to="/login">
                    <Button>Administration</Button>
                  </Link>
                )
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