import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Need } from "@/types/needs";
import { formatAge } from "@/utils/dates";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ChildCardProps {
  child: any;
  photosByChild: Record<string, any[]>;
  hasUrgentNeeds: boolean;
  onImageLoad: (event: React.SyntheticEvent<HTMLImageElement>, photoUrl: string) => void;
  onSponsorClick: (childId: string) => void;
}

export const ChildCard = ({ 
  child, 
  photosByChild, 
  hasUrgentNeeds,
  onImageLoad,
  onSponsorClick 
}: ChildCardProps) => {
  return (
    <Card 
      key={child.id} 
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-white to-cuba-warmBeige/20 backdrop-blur-sm border border-cuba-warmBeige"
    >
      <div className="aspect-video relative">
        <OptimizedImage
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="w-full h-full object-cover transition-transform duration-300"
          onLoad={(e) => onImageLoad(e, child.photo_url)}
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        {hasUrgentNeeds && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold animate-pulse">
            BESOIN URGENT
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <h3 className="text-lg font-title font-bold text-white truncate">{child.name}</h3>
          <div className="flex items-center gap-1 text-sm text-white/90">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{formatAge(child.birth_date)}</span>
            <MapPin className="w-4 h-4 flex-shrink-0 ml-1" />
            <span className="truncate">{child.city}</span>
          </div>
        </div>
      </div>

      <div className="p-2 space-y-2">
        {photosByChild[child.id]?.length > 0 && (
          <div className="bg-white/80 rounded-lg p-2">
            <h4 className="font-medium text-sm mb-2 text-cuba-warmGray">Album photos</h4>
            <div className="grid grid-cols-3 gap-2">
              {photosByChild[child.id].slice(0, 3).map((photo: any) => (
                <div key={photo.id} className="aspect-square rounded-md overflow-hidden">
                  <OptimizedImage
                    src={photo.url}
                    alt="Photo album"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {child.description && (
          <div className="bg-white/80 rounded-lg p-2">
            <p className="text-sm text-gray-700 line-clamp-2">{child.description}</p>
          </div>
        )}

        <NeedsList needs={child.needs} />

        <Button 
          onClick={() => onSponsorClick(child.id)}
          className={`w-full ${
            hasUrgentNeeds
              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              : "bg-gradient-to-r from-cuba-coral to-cuba-gold hover:from-cuba-coral/90 hover:to-cuba-gold/90 text-white"
          } group-hover:scale-105 transition-all duration-300`}
        >
          <Heart className="w-4 h-4 mr-2" />
          Parrainer
        </Button>
      </div>
    </Card>
  );
};

const NeedsList = ({ needs }: { needs: Need[] }) => (
  <div className="space-y-1">
    {Array.isArray(needs) && needs.length > 0 && needs.map((need: Need, index: number) => (
      <div
        key={`${need.category}-${index}`}
        className={`p-2 rounded-lg ${
          need.is_urgent
            ? "bg-[#ea384c] text-white font-medium"
            : "bg-orange-50 border border-orange-200 text-orange-700"
        }`}
      >
        <div className="text-sm font-medium truncate">
          {need.category}
          {need.is_urgent && " (!)"} 
        </div>
        {need.description && (
          <p className="text-sm opacity-90 mt-1">{need.description}</p>
        )}
      </div>
    ))}
  </div>
);