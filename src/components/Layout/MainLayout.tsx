import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";
import { UserProfileMenu } from "./UserProfileMenu";
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
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "react-router-dom";

const MainLayout = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isSponsor = user?.role === 'sponsor' || (isAdmin && user?.children_sponsored?.length > 0);

  const assistantNavItems = [
    { icon: Home, label: t('dashboard'), path: '/dashboard' },
    { icon: Users, label: t('children'), path: '/children' },
    { icon: Gift, label: t('donations'), path: '/donations' },
    { icon: MessageSquare, label: t('messages'), path: '/messages' },
  ];

  const adminNavItems = [
    { icon: Settings, label: t('permissions'), path: '/admin/permissions' },
    { icon: Languages, label: t('translationManager'), path: '/admin/translations' },
    { icon: CheckCircle2, label: t('validation'), path: '/admin/validation' },
    { icon: ChartBar, label: t('statistics'), path: '/admin/statistics' },
    { icon: Heart, label: t('sponsorshipManagement'), path: '/admin/sponsorships' },
    { icon: Mail, label: t('emailManager'), path: '/admin/emails' },
    { icon: HelpCircle, label: t('faq'), path: '/admin/faq' },
    { icon: MapPin, label: t('citiesManagement'), path: '/admin/cities' },
    { icon: Bell, label: t('notifications'), path: '/admin/notifications' },
    { icon: Image, label: t('homeContent'), path: '/admin/home-content' },
    { icon: LayoutDashboard, label: t('homepage'), path: '/admin/homepage' },
  ];

  const sponsorNavItems = [
    { icon: User, label: t('profile'), path: '/sponsor-dashboard' }
  ];

  const mobileNavItems = [
    ...assistantNavItems,
    ...(isAdmin ? adminNavItems : []),
    ...(isSponsor ? sponsorNavItems : [])
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:block w-64 fixed h-full">
        <Sidebar />
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <nav className="flex justify-around items-center h-16 overflow-x-auto">
          {mobileNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 min-w-[72px] ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1 text-center">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <main className="flex-1 md:ml-64 pb-16 md:pb-0">
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <LanguageSelector />
          <UserProfileMenu />
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