import { useState } from "react";
import { EditSponsorDialog } from "./EditSponsorDialog";
import { SponsorCard } from "./SponsorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsorsListProps {
  sponsors: any[];
  isLoading: boolean;
}

export const SponsorsList = ({ sponsors: initialSponsors, isLoading }: SponsorsListProps) => {
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [editingSponsor, setEditingSponsor] = useState<any>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
        <TabsTrigger value="active">{t("activeSponsors")}</TabsTrigger>
        <TabsTrigger value="inactive">{t("inactiveSponsors")}</TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <div className="grid gap-6 md:grid-cols-2">
          {sponsors
            .filter(sponsor => sponsor.is_active)
            .map((sponsor) => (
              <SponsorCard
                key={sponsor.id}
                sponsor={sponsor}
                onEdit={setEditingSponsor}
                onViewAlbum={viewAlbum}
                onStatusChange={handleStatusChange}
              />
            ))}
        </div>
      </TabsContent>

      <TabsContent value="inactive">
        <div className="grid gap-6 md:grid-cols-2">
          {sponsors
            .filter(sponsor => !sponsor.is_active)
            .map((sponsor) => (
              <SponsorCard
                key={sponsor.id}
                sponsor={sponsor}
                onEdit={setEditingSponsor}
                onViewAlbum={viewAlbum}
                onStatusChange={handleStatusChange}
              />
            ))}
        </div>
      </TabsContent>

      <EditSponsorDialog
        sponsor={editingSponsor}
        open={!!editingSponsor}
        onClose={() => setEditingSponsor(null)}
      />
    </Tabs>
  );
};