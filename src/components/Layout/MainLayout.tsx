import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Home/Navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  const showSidebar = user?.role === 'admin' || user?.role === 'assistant';

  return (
    <div className="min-h-screen bg-cuba-offwhite flex flex-col">
      {/* Top Navigation for all users - Now sticky */}
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <Navigation />
      </div>

      <div className="flex-1 flex">
        {showSidebar && (
          <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[80%] sm:w-[350px] bg-cuba-offwhite">
                  <Sidebar />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Sidebar - Always visible */}
            <div className="hidden md:block w-64 fixed h-full">
              <Sidebar />
            </div>
          </>
        )}

        <main className={`flex-1 ${showSidebar ? 'md:ml-64' : ''} pb-16 md:pb-0`}>
          <div className="p-4 md:p-8">
            <div className="container mx-auto animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;