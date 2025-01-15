import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Camera, Clock, FileEdit } from "lucide-react";
import { useState } from "react";
import { TerminationDialog } from "../TerminationDialog";

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
  const { t } = useLanguage();
  const [showTermination, setShowTermination] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={child.photo_url} alt={child.name} />
            <AvatarFallback>{child.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{child.name}</h3>
            {child.age && (
              <p className="text-sm text-gray-500">
                {child.age} {t("years")}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddPhoto}
          >
            <Camera className="h-4 w-4 mr-2" />
            {t("addPhoto")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddTestimonial}
          >
            <FileEdit className="h-4 w-4 mr-2" />
            {t("addTestimonial")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTermination(true)}
          >
            <Clock className="h-4 w-4 mr-2" />
            {t("endSponsorship")}
          </Button>
        </div>
      </div>

      <TerminationDialog
        isOpen={showTermination}
        onClose={() => setShowTermination(false)}
        sponsorshipId={sponsorshipId}
        childName={child.name}
        onTerminationComplete={() => window.location.reload()}
      />
    </Card>
  );
};