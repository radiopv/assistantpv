import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthProvider";
import { 
  LayoutDashboard, 
  Menu,
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="mobile-menu p-0">
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto py-6 px-4">
                  <div className="space-y-4">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="border-t p-4">
                  {session ? (
                    isAdminOrAssistant ? (
                      <Link to="/dashboard">
                        <Button className="w-full h-12 text-base">
                          <LayoutDashboard className="mr-2 h-5 w-5" />
                          Administration
                        </Button>
                      </Link>
                    ) : null
                  ) : (
                    <Link to="/login">
                      <Button className="w-full h-12 text-base">
                        Administration
                      </Button>
                    </Link>
                  )}
                </div>
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
            <div>
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
                <Link to="/login">
                  <Button>Administration</Button>
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