import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";
import { UserProfileMenu } from "./UserProfileMenu";
import { LanguageSelector } from "@/components/LanguageSelector";
import { 
  Menu, 
  Home, 
  Users, 
  Gift, 
  MessageSquare, 
  Settings,
  Languages,
  CheckCircle2,
  ChartBar,
  HelpCircle,
  Mail,
  Heart,
  MapPin,
  Bell,
  User,
  LayoutDashboard,
  Image
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';
  const isAssistant = user?.role === 'assistant';
  const isSponsor = user?.role === 'sponsor' || (isAdmin && user?.children_sponsored?.length > 0);

  const assistantNavItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Enfants', path: '/children' },
    { icon: Gift, label: 'Donations', path: '/donations' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
  ];

  // Navigation items for admins
  const adminNavItems = [
    { icon: Settings, label: 'Permissions', path: '/admin/permissions' },
    { icon: Languages, label: 'Traductions', path: '/admin/translations' },
    { icon: CheckCircle2, label: 'Validation', path: '/admin/validation' },
    { icon: ChartBar, label: 'Statistiques', path: '/admin/statistics' },
    { icon: Heart, label: 'Gestion des parrainages', path: '/admin/sponsorships' },
    { icon: Mail, label: 'Gestion des emails', path: '/admin/emails' },
    { icon: HelpCircle, label: 'FAQ', path: '/admin/faq' },
    { icon: MapPin, label: 'Gestion des villes', path: '/admin/cities' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Image, label: 'Contenu accueil', path: '/admin/home-content' },
    { icon: LayoutDashboard, label: 'Page d\'accueil', path: '/admin/homepage' },
  ];

  // Navigation items for sponsors
  const sponsorNavItems = [
    { icon: User, label: 'Profil', path: '/sponsor-dashboard' }
  ];

  // Get the appropriate navigation items based on user role
  const getNavItems = () => {
    if (isAdmin) {
      return [...assistantNavItems, ...adminNavItems];
    }
    if (isAssistant) {
      return assistantNavItems;
    }
    if (isSponsor) {
      return sponsorNavItems;
    }
    return [];
  };

  const handleSponsorDashboardClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/sponsor-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block w-64 fixed h-full">
        <Sidebar />
      </div>

      <main className="flex-1 md:ml-64 pb-16 md:pb-0">
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleSponsorDashboardClick}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Espace parrain
          </Button>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <UserProfileMenu />
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div className="container mx-auto animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
