import { GroupedSponsorship } from "@/integrations/supabase/types/sponsorship";
import { SponsorshipCard } from "./SponsorshipCard";

interface SponsorshipListProps {
  sponsorships: GroupedSponsorship[];
  onDelete: (sponsorshipId: string) => void;
}

export const SponsorshipList = ({ sponsorships, onDelete }: SponsorshipListProps) => {
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
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};