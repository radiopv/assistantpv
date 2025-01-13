import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DashboardActions } from "./DashboardActions";
import PhotoAlbumSection from "./PhotoAlbumSection";
import { StatisticsSection } from "./StatisticsSection";
import { useState } from "react";

interface DashboardTabsProps {
  sponsorships: any[];
  userId: string;
  plannedVisits: any[];
}

export const DashboardTabs = ({ sponsorships, userId, plannedVisits }: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState('actions');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs defaultValue="actions" value={activeTab} className="w-full" onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="actions">Actions</TabsTrigger>
        <TabsTrigger value="gallery">Album Photos</TabsTrigger>
        <TabsTrigger value="statistics">Statistiques</TabsTrigger>
      </TabsList>

      <TabsContent value="actions">
        <DashboardActions onTabChange={handleTabChange} />
      </TabsContent>

      <TabsContent value="gallery">
        <Card className="p-6">
          {sponsorships.map((sponsorship) => (
            <PhotoAlbumSection
              key={sponsorship.children.id}
              childId={sponsorship.children.id}
              sponsorId={userId}
              childName={sponsorship.children.name}
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