import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, Gift, Home, Menu, X, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/components/Auth/AuthProvider";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { signOut } = useAuth();

  const links = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Enfants", path: "/children" },
    { icon: Heart, label: "Parrainages", path: "/sponsorships" },
    { icon: Gift, label: "Dons", path: "/donations" },
  ];

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-white shadow-lg transition-transform duration-300",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          "w-64 p-4"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-primary">TousPourCuba</h1>
            <p className="text-sm text-gray-600">Espace Assistant</p>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              {links.map(({ icon: Icon, label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                      "hover:bg-gray-100",
                      location.pathname === path
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "text-gray-700"
                    )}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-gray-200 space-y-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
            <p className="text-sm text-gray-600 text-center">
              © 2024 TousPourCuba
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;