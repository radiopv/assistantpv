import { ChildrenList } from "@/components/AssistantSponsorship/ChildrenList";
import { SponsorsList } from "@/components/AssistantSponsorship/SponsorsList";

interface AssociationGridProps {
  children: any[];
  sponsors: any[];
  searchChild: string;
  searchSponsor: string;
  onSearchChildChange: (value: string) => void;
  onSearchSponsorChange: (value: string) => void;
  onSelectChild: (id: string) => void;
  onSelectSponsor: (id: string) => void;
  onRemoveSponsorship: (childId: string) => Promise<void>;
}

export const AssociationGrid = ({
  children,
  sponsors,
  searchChild,
  searchSponsor,
  onSearchChildChange,
  onSearchSponsorChange,
  onSelectChild,
  onSelectSponsor,
  onRemoveSponsorship,
}: AssociationGridProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <ChildrenList
        children={children}
        searchTerm={searchChild}
        onSearchChange={onSearchChildChange}
        onSelectChild={onSelectChild}
        onRemoveSponsorship={onRemoveSponsorship}
      />

      <SponsorsList
        sponsors={sponsors}
        searchTerm={searchSponsor}
        onSearchChange={onSearchSponsorChange}
        onSelectSponsor={onSelectSponsor}
      />
    </div>
  );
};