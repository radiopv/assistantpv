import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DashboardActions } from "./DashboardActions";
import { PhotoAlbumSection } from "./PhotoAlbumSection";
import { VisitsSection } from "./VisitsSection";
import { ImportantDatesCard } from "./ImportantDatesCard";
import { StatisticsSection } from "./StatisticsSection";

interface DashboardTabsProps {
  sponsorships: any[];
  userId: string;
  plannedVisits: any[];
}

export const DashboardTabs = ({ sponsorships, userId, plannedVisits }: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="actions" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="actions">Actions</TabsTrigger>
        <TabsTrigger value="gallery">Album Photos</TabsTrigger>
        <TabsTrigger value="visits">Visites Prévues</TabsTrigger>
        <TabsTrigger value="statistics">Statistiques</TabsTrigger>
      </TabsList>

      <TabsContent value="actions">
        <DashboardActions />
      </TabsContent>

      <TabsContent value="gallery">
        <Card className="p-6">
          {sponsorships.map((sponsorship) => (
            <PhotoAlbumSection
              key={sponsorship.id}
              childId={sponsorship.children.id}
              sponsorId={userId}
              childName={sponsorship.children.name}
            />
          ))}
        </Card>
      </TabsContent>

      <TabsContent value="visits">
        <Card className="p-6">
          {sponsorships.map((sponsorship) => (
            <ImportantDatesCard
              key={sponsorship.id}
              birthDate={sponsorship.children.birth_date}
              plannedVisits={plannedVisits?.filter(v => v.sponsor_id === userId)}
            />
          ))}
        </Card>
      </TabsContent>

      <TabsContent value="statistics">
        <StatisticsSection />
      </TabsContent>
    </Tabs>
  );
};