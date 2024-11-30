import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useTranslation } from "@/components/Translation/TranslationContext";
import { LogOut } from "lucide-react";
import { SidebarNavItems } from "./SidebarNavItems";

const Sidebar = () => {
  const { signOut } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="p-4 md:p-6">
        <Link to="/">
          <h1 className="text-lg md:text-xl font-bold">Passion Varadero</h1>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-2 md:px-3 py-2">
            <SidebarNavItems />
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("nav.logout")}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;