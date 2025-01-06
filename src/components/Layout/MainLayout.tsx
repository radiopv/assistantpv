import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { UserProfileMenu } from "./UserProfileMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isMobile, isOpen, setIsOpen } = useMobile();
  const { t } = useLanguage();

  return (
    <div className="flex h-screen">
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar isMobile onClose={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-4">
          <h1 className="text-2xl font-semibold">{t("dashboard")}</h1>
          <UserProfileMenu />
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;