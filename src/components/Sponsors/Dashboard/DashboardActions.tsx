import { Button } from "@/components/ui/button";
import { Heart, Image, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DashboardActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Button
        onClick={() => navigate("/messages")}
        variant="outline"
        className="h-auto p-4 flex items-center gap-3"
      >
        <MessageSquare className="w-5 h-5" />
        <div className="text-left">
          <p className="font-semibold">Messages</p>
          <p className="text-sm text-gray-600">
            Communiquez avec les assistants
          </p>
        </div>
      </Button>

      <Button
        onClick={() => navigate("/favorites")}
        variant="outline"
        className="h-auto p-4 flex items-center gap-3"
      >
        <Heart className="w-5 h-5" />
        <div className="text-left">
          <p className="font-semibold">Favoris</p>
          <p className="text-sm text-gray-600">
            Gérez vos enfants favoris
          </p>
        </div>
      </Button>

      <Button
        onClick={() => navigate("/photo-album")}
        variant="outline"
        className="h-auto p-4 flex items-center gap-3"
      >
        <Image className="w-5 h-5" />
        <div className="text-left">
          <p className="font-semibold">Album photo</p>
          <p className="text-sm text-gray-600">
            Consultez les photos
          </p>
        </div>
      </Button>
    </div>
  );
};