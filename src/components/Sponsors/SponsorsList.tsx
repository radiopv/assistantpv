import { useState } from "react";
import { SponsorCard } from "./SponsorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SponsorshipAccordion } from "./SponsorshipAccordion";

interface SponsorsListProps {
  sponsors: any[];
  isLoading: boolean;
}

export const SponsorsList = ({ sponsors: initialSponsors, isLoading }: SponsorsListProps) => {
  const [sponsors, setSponsors] = useState(initialSponsors);
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

      <TabsContent value="active">
        <div className="space-y-6">
          {sponsors
            .filter(sponsor => sponsor.is_active)
            .map((sponsor) => (
              <Card key={sponsor.id} className="p-6">
                <SponsorshipAccordion
                  sponsor={sponsor}
                  onUpdate={() => {
                    // Refresh the sponsors list
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
          {sponsors
            .filter(sponsor => !sponsor.is_active)
            .map((sponsor) => (
              <Card key={sponsor.id} className="p-6">
                <SponsorshipAccordion
                  sponsor={sponsor}
                  onUpdate={() => {
                    // Refresh the sponsors list
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