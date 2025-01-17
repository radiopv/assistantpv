import { Card } from "@/components/ui/card";
import { SponsorCard } from "../SponsorshipManagement/SponsorCard";

interface SponsorshipListProps {
  sponsors: any[];
  title: string;
  onVerificationChange: (sponsorId: string, checked: boolean) => void;
  onRemoveChild: (sponsorId: string, childId: string) => void;
  onAddChild: (sponsorId: string, childId: string) => void;
  availableChildren: any[];
}

export const SponsorshipList = ({
  sponsors,
  title,
  onVerificationChange,
  onRemoveChild,
  onAddChild,
  availableChildren
}: SponsorshipListProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {sponsors.map((sponsor) => (
          <SponsorCard
            key={sponsor.id}
            sponsor={sponsor}
            onVerificationChange={onVerificationChange}
            onRemoveChild={onRemoveChild}
            onAddChild={(childId) => onAddChild(sponsor.id, childId)}
            availableChildren={availableChildren}
          />
        ))}
      </div>
    </div>
  );
};