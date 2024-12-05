import { SponsoredChildrenList } from "../SponsoredChildrenList";
import { AlbumSection } from "../AlbumSection";
import type { SponsoredChild } from "@/types/sponsorship";

interface ChildrenTabProps {
  sponsoredChildren: SponsoredChild[];
  selectedChild: string | null;
  onSelectChild: (childId: string) => void;
  userId: string;
}

export const ChildrenTab = ({ 
  sponsoredChildren, 
  selectedChild, 
  onSelectChild,
  userId 
}: ChildrenTabProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <SponsoredChildrenList
          children={sponsoredChildren}
          selectedChild={selectedChild}
          onSelectChild={onSelectChild}
        />
      </div>

      <div>
        {selectedChild && userId && (
          <AlbumSection 
            childId={selectedChild} 
            sponsorId={userId} 
          />
        )}
      </div>
    </div>
  );
};