import { Button } from "@/components/ui/button";
import { Camera, Video } from "lucide-react";

interface UploadButtonsProps {
  showPhotoUpload: boolean;
  showVideoUpload: boolean;
  onPhotoUploadClick: () => void;
  onVideoUploadClick: () => void;
}

export const UploadButtons = ({
  showPhotoUpload,
  showVideoUpload,
  onPhotoUploadClick,
  onVideoUploadClick,
}: UploadButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPhotoUploadClick}
        className="flex items-center gap-2"
      >
        <Camera className="w-4 h-4" />
        {showPhotoUpload ? "Fermer" : "Ajouter des photos"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onVideoUploadClick}
        className="flex items-center gap-2"
      >
        <Video className="w-4 h-4" />
        {showVideoUpload ? "Fermer" : "Ajouter des vidéos"}
      </Button>
    </div>
  );
};