import { GroupedSponsorship } from "@/integrations/supabase/types/sponsorship";
import { SponsorshipCard } from "./SponsorshipCard";

interface SponsorshipListProps {
  sponsorships: GroupedSponsorship[];
  onDeleteSponsorship: (sponsorshipId: string) => void;
  onAddChild: (sponsorId: string) => void;
}

export const SponsorshipList = ({ 
  sponsorships, 
  onDeleteSponsorship,
  onAddChild 
}: SponsorshipListProps) => {
  if (sponsorships.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun parrainage trouvé
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {sponsorships.map((group) => (
        <SponsorshipCard
          key={group.sponsor.email}
          group={group}
          onDeleteSponsorship={onDeleteSponsorship}
          onAddChild={onAddChild}
        />
      ))}
    </div>
  );
};