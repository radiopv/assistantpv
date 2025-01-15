import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, FileEdit, Clock } from "lucide-react";

interface SponsoredChildCardProps {
  child: {
    id: string;
    name: string;
    photo_url?: string;
    age?: number | null;
  };
  sponsorshipId: string;
  onAddPhoto: () => void;
  onAddTestimonial: () => void;
}

export const SponsoredChildCard = ({
  child,
  sponsorshipId,
  onAddPhoto,
  onAddTestimonial,
}: SponsoredChildCardProps) => {
  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={child.photo_url} alt={child.name} />
            <AvatarFallback>{child.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{child.name}</h3>
            {child.age && (
              <p className="text-sm text-gray-500">
                {child.age} ans
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddPhoto}
          className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
        >
          <Camera className="h-4 w-4" />
          Ajouter une photo
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onAddTestimonial}
          className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
        >
          <FileEdit className="h-4 w-4" />
          Ajouter un témoignage
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTermination(true)}
          className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 sm:col-span-2"
        >
          <Clock className="h-4 w-4" />
          Mettre fin au parrainage
        </Button>
      </div>
    </Card>
  );
};