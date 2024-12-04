import { Bell, MessageSquare, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotificationBar = () => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" className="relative">
        <MessageSquare className="h-5 w-5" />
      </Button>

      <Button variant="ghost" size="icon" className="relative">
        <CheckSquare className="h-5 w-5" />
      </Button>
    </div>
  );
};