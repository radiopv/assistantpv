import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Camera,
  UserPlus,
} from "lucide-react";

interface AssistantMenuProps {
  isActive: (path: string) => boolean;
}

export const AssistantMenu = ({ isActive }: AssistantMenuProps) => {
  return (
    <>
      <Link
        to="/assistant-photos"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
          isActive("/assistant-photos") && "bg-gray-50 text-primary"
        )}
      >
        <Camera className="w-5 h-5" />
        <span>Photos</span>
      </Link>

      <Link
        to="/assistant/sponsorship"
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
          isActive("/assistant/sponsorship") && "bg-gray-50 text-primary"
        )}
      >
        <UserPlus className="w-5 h-5" />
        <span>Parrainages</span>
      </Link>
    </>
  );
};