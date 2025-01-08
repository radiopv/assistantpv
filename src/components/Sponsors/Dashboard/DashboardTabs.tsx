import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DashboardActions } from "./DashboardActions";
import { PhotoAlbumSection } from "./PhotoAlbumSection";
import { VisitsSection } from "./VisitsSection";

interface DashboardTabsProps {
  childId: string;
  sponsorId: string;
  plannedVisits: any[];
}

export const DashboardTabs = ({ childId, sponsorId, plannedVisits }: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="actions" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="actions">Actions</TabsTrigger>
        <TabsTrigger value="gallery">Album Photos</TabsTrigger>
        <TabsTrigger value="visits">Visites Prévues</TabsTrigger>
      </TabsList>

      <TabsContent value="actions" className="space-y-4">
        <DashboardActions />
      </TabsContent>

      <TabsContent value="gallery" className="space-y-4">
        <PhotoAlbumSection childId={childId} sponsorId={sponsorId} />
      </TabsContent>

      <TabsContent value="visits" className="space-y-4">
        <Card className="p-6">
          <VisitsSection visits={plannedVisits} />
        </Card>
      </TabsContent>
    </Tabs>
  );
};