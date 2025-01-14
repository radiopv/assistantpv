import { Card } from "@/components/ui/card";
import { ChartBar, Heart, Camera, MessageSquare, Clock } from "lucide-react";

interface ContributionStatsProps {
  totalPhotos: number;
  totalTestimonials: number;
  totalNeeds: number;
  sponsorshipDays: number;
}

export const ContributionStats = ({
  totalPhotos,
  totalTestimonials,
  totalNeeds,
  sponsorshipDays
}: ContributionStatsProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ChartBar className="w-5 h-5 text-cuba-coral" />
        Vos contributions
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">Photos</span>
          </div>
          <p className="text-2xl font-bold">{totalPhotos}</p>
        </div>
        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">Témoignages</span>
          </div>
          <p className="text-2xl font-bold">{totalTestimonials}</p>
        </div>
        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">Besoins comblés</span>
          </div>
          <p className="text-2xl font-bold">{totalNeeds}</p>
        </div>
        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">Jours de parrainage</span>
          </div>
          <p className="text-2xl font-bold">{sponsorshipDays}</p>
        </div>
      </div>
    </Card>
  );
};