import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";
import { UserProfileMenu } from "./UserProfileMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Users, Gift, MessageSquare, Settings } from "lucide-react";
import { useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "react-router-dom";

const MainLayout = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const mobileNavItems = [
    { icon: Home, label: t('dashboard'), path: '/dashboard' },
    { icon: Users, label: t('children'), path: '/children' },
    { icon: Gift, label: t('donations'), path: '/donations' },
    { icon: MessageSquare, label: t('messages'), path: '/messages' },
    { icon: Settings, label: t('settings'), path: '/settings' },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed h-full">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <nav className="flex justify-around items-center h-16">
          {mobileNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
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