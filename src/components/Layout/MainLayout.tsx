import { ReactNode } from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";
import { 
  LayoutDashboard, 
  Users, 
  Heart,
  BookOpen,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const isAssistantOrAdmin = ['admin', 'assistant'].includes(user.role);
  if (!isAssistantOrAdmin) {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    {
      href: "/",
      label: "Accueil",
      icon: LayoutDashboard,
    },
    {
      href: "/children",
      label: "Enfants",
      icon: Users,
    },
    {
      href: "/stories",
      label: "Histoires",
      icon: BookOpen,
    },
    {
      href: "/sponsorships",
      label: "Parrainages",
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Menu - Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">
            Passion Varadero
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col space-y-4 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Public Menu - Desktop */}
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
          </div>
        </div>
      </div>

      {/* Admin Layout */}
      <div className="flex pt-16">
        <div className="w-64 fixed h-full">
          <Sidebar />
        </div>
        <main className="flex-1 ml-64 p-8">
          <div className="container mx-auto animate-fade-in">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;