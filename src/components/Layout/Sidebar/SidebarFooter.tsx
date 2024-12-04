import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SidebarFooterProps {
  onSignOut: () => void;
  onClose?: () => void;
}

export const SidebarFooter = ({ onSignOut, onClose }: SidebarFooterProps) => {
  return (
    <div className="p-4 border-t">
      <Button
        variant="ghost"
        className="w-full justify-start min-h-[44px]"
        onClick={() => {
          onSignOut();
          onClose?.();
        }}
      >
        <LogOut className="mr-2 h-5 w-5" />
        Déconnexion
      </Button>
    </div>
  );
};