import { Button } from "@/components/ui/button";
import { Image, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button
        onClick={() => navigate("/messages")}
        variant="outline"
        className="h-auto p-4 flex items-center gap-3"
      >
        <MessageSquare className="w-5 h-5" />
        <div className="text-left">
          <p className="font-semibold">Message à l'assistant</p>
          <p className="text-sm text-gray-600">
            Communiquez avec votre assistant
          </p>
        </div>
      </Button>

      <Button
        onClick={() => navigate("/sponsor-album")}
        variant="outline"
        className="h-auto p-4 flex items-center gap-3"
      >
        <Image className="w-5 h-5" />
        <div className="text-left">
          <p className="font-semibold">Album photos</p>
          <p className="text-sm text-gray-600">
            Gérez les photos de votre filleul(e)
          </p>
        </div>
      </Button>
    </div>
  );
};