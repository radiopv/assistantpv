import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/components/Auth/AuthProvider";
import { UserProfileMenu } from "./UserProfileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) {
    return null;
  }

  const sidebarContent = <Sidebar />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-64 fixed h-full">
          {sidebarContent}
        </div>
      )}
      <main className={`flex-1 ${!isMobile ? "ml-64" : "ml-0"}`}>
        <div className="p-4 border-b bg-white flex justify-end">
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