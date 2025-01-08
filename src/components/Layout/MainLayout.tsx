import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { UserProfileMenu } from "./UserProfileMenu";
import { useAuth } from "@/components/Auth/AuthProvider";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cuba-warmBeige flex">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-cuba-offwhite hover:bg-cuba-warmBeige">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[80%] sm:w-[350px] bg-cuba-warmBeige">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar - Always visible */}
      <div className="hidden md:block w-64 fixed h-full">
        <Sidebar />
      </div>

      <main className="flex-1 md:ml-64 pb-16 md:pb-0">
        <div className="p-4 border-b border-cuba-turquoise/20 bg-cuba-warmBeige flex justify-end items-center">
          <UserProfileMenu />
        </div>
        <div className="p-4 md:p-8 bg-cuba-warmBeige">
          <div className="container mx-auto animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};