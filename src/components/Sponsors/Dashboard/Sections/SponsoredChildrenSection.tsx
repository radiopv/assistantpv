import { Card } from "@/components/ui/card";
import { SponsoredChildCard } from "../Cards/SponsoredChildCard";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";

interface SponsoredChildrenSectionProps {
  sponsoredChildren: any[];
  selectedChild: string | null;
  onAddPhoto: (childId: string) => void;
  onUploadSuccess: () => void;
}

export const SponsoredChildrenSection = ({
  sponsoredChildren,
  selectedChild,
  onAddPhoto,
  onUploadSuccess
}: SponsoredChildrenSectionProps) => {
  return (
    <>
      {sponsoredChildren?.map((sponsorship) => {
        const child = sponsorship.children;
        if (!child) return null;

        return (
          <div key={child.id} className="space-y-6">
            <SponsoredChildCard
              child={child}
              sponsorshipId={sponsorship.id}
              onAddPhoto={() => onAddPhoto(child.id)}
            />

            {selectedChild === child.id && (
              <Card className="p-4">
                <PhotoUploader
                  childId={selectedChild}
                  onUploadSuccess={onUploadSuccess}
                />
              </Card>
            )}
          </div>
        );
      })}
    </>
  );
};