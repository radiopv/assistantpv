import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthProvider";
import { 
  LayoutDashboard, 
  Users, 
  Heart,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const PublicLayout = () => {
  const { session, user } = useAuth();
  const isMobile = useIsMobile();

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
      href: "/sponsorships",
      label: "Parrainages",
      icon: Heart,
    },
  ];

  const isAdminOrAssistant = user?.role === 'admin' || user?.role === 'assistant';

  const navigationContent = (
    <div className="flex flex-col space-y-4">
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
        isAdminOrAssistant ? (
          <Link to="/dashboard">
            <Button className="w-full">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Administration
            </Button>
          </Link>
        ) : null
      ) : (
        <Link to="/login">
          <Button className="w-full">Administration</Button>
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">
            Passion Varadero
          </Link>
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                {navigationContent}
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center space-x-4">
              {navigationContent}
            </div>
          )}
        </div>
      </div>

      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;