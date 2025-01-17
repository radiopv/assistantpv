import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoAlbum } from "./PhotoAlbum";
import { ChildDescription } from "./ChildDescription";
import { ChildStory } from "./ChildStory";
import { ChildNeedsList } from "./ChildNeedsList";
import { convertJsonToNeeds } from "@/types/needs";

interface ChildCardProps {
  child: any;
  photosByChild: Record<string, any[]>;
  onLearnMore: (childId: string) => void;
}

export const ChildCard = ({ child, photosByChild, onLearnMore }: ChildCardProps) => {
  const childNeeds = convertJsonToNeeds(child.needs);
  const hasUrgentNeeds = Array.isArray(childNeeds) && childNeeds.some(need => need.is_urgent);

  return (
    <div className="space-y-4">
      {photosByChild[child.id]?.length > 0 && (
        <PhotoAlbum photos={photosByChild[child.id]} />
      )}

      <ChildDescription description={child.description} />
      <ChildStory story={child.story} />

      <div className="pt-2 border-t border-cuba-softOrange/20">
        <h4 className="font-medium text-sm mb-2 text-cuba-warmGray">Besoins</h4>
        <ChildNeedsList needs={childNeeds} />
      </div>

      <Button 
        onClick={() => onLearnMore(child.id)}
        className={`w-full ${
          hasUrgentNeeds
            ? "bg-[#F2FCE2] hover:bg-[#E2ECD2] text-emerald-800"
            : "bg-[#F2FCE2] hover:bg-[#E2ECD2] text-emerald-800"
        } group-hover:scale-105 transition-all duration-300`}
      >
        <Info className="w-4 h-4 mr-2" />
        En savoir plus
      </Button>
    </div>
  );
};