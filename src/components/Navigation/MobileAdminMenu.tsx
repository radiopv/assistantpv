import { Button } from "@/components/ui/button";
import { Home, Users, Gift, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileAdminMenuProps {
  isAssistant: boolean;
}

export const MobileAdminMenu = ({ isAssistant }: MobileAdminMenuProps) => {
  const navigate = useNavigate();

  if (!isAssistant) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-cuba-coral/90 backdrop-blur-sm border-t border-cuba-coral/20 px-2 py-1 md:hidden z-50">
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex items-center gap-2 px-4 min-w-max">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-white hover:text-white/80"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Accueil</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/admin/children-management")}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-white hover:text-white/80"
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Enfants</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/admin/donations-management")}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-white hover:text-white/80"
          >
            <Gift className="h-5 w-5" />
            <span className="text-xs mt-1">Dons</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/notifications")}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-white hover:text-white/80"
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs mt-1">Notifs</span>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};