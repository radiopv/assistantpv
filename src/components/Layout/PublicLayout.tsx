import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/Home/Navigation";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite">
      {/* Navigation */}
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-cuba-coral/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Navigation />
            
            {/* Login Button - Always visible */}
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-cuba-coral hover:text-cuba-coral/80 transition-colors"
            >
              <UserCircle2 className="h-5 w-5" />
              <span className="hidden sm:inline">Connexion</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;