import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Sponsor {
  id: string;
  name: string;
  email: string;
}

interface SponsorsListProps {
  sponsors: Sponsor[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectSponsor: (sponsorId: string) => void;
}

export function SponsorsList({
  sponsors,
  searchTerm,
  onSearchChange,
  onSelectSponsor,
}: SponsorsListProps) {
  const filteredSponsors = sponsors.filter((sponsor) =>
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Parrains</h2>
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Rechercher un parrain..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredSponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{sponsor.name}</p>
              <p className="text-sm text-gray-600">{sponsor.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => onSelectSponsor(sponsor.id)}
            >
              Sélectionner
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}