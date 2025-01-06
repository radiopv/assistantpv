import { useState } from "react";
import { SponsorCard } from "./SponsorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SponsorshipAccordion } from "./SponsorshipAccordion";
import { SearchInput } from "@/components/ui/search-input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SponsorsListProps {
  sponsors: any[];
  isLoading: boolean;
}

export const SponsorsList = ({ sponsors: initialSponsors, isLoading }: SponsorsListProps) => {
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const navigate = useNavigate();

  const handleStatusChange = (sponsorId: string, field: string, value: boolean) => {
    setSponsors(prevSponsors => 
      prevSponsors.map(sponsor => 
        sponsor.id === sponsorId 
          ? { ...sponsor, [field]: value }
          : sponsor
      )
    );
  };

  const viewAlbum = (childId: string) => {
    navigate(`/children/${childId}/album`);
  };

  const filterAndSortSponsors = (sponsors: any[], isActive: boolean) => {
    // Filtrer d'abord par le terme de recherche
    let filtered = sponsors.filter(sponsor => {
      const searchString = `${sponsor.name} ${sponsor.email} ${sponsor.city}`.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      return sponsor.is_active === isActive && searchString.includes(searchTermLower);
    });

    // Trier ensuite selon l'ordre sélectionné
    return filtered.sort((a, b) => {
      if (sortOrder === "recent") {
        // Trouver la date de parrainage la plus récente pour chaque sponsor
        const latestA = Math.max(...(a.sponsorships?.map((s: any) => new Date(s.start_date).getTime()) || [0]));
        const latestB = Math.max(...(b.sponsorships?.map((s: any) => new Date(s.start_date).getTime()) || [0]));
        return latestB - latestA;
      } else if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="active">Parrains actifs</TabsTrigger>
        <TabsTrigger value="inactive">Parrains inactifs</TabsTrigger>
      </TabsList>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Rechercher par nom, email ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Trier par..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="name">Nom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TabsContent value="active">
        <div className="space-y-6">
          {filterAndSortSponsors(sponsors, true).map((sponsor) => (
            <Card key={sponsor.id} className="p-6">
              <SponsorshipAccordion
                sponsor={sponsor}
                onUpdate={() => {
                  setSponsors(prevSponsors =>
                    prevSponsors.map(s =>
                      s.id === sponsor.id
                        ? { ...s, ...sponsor }
                        : s
                    )
                  );
                }}
              />
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="inactive">
        <div className="space-y-6">
          {filterAndSortSponsors(sponsors, false).map((sponsor) => (
            <Card key={sponsor.id} className="p-6">
              <SponsorshipAccordion
                sponsor={sponsor}
                onUpdate={() => {
                  setSponsors(prevSponsors =>
                    prevSponsors.map(s =>
                      s.id === sponsor.id
                        ? { ...s, ...sponsor }
                        : s
                    )
                  );
                }}
              />
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};