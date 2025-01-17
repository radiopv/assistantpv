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
    <Tabs defaultValue="actions" value={activeTab} className="w-full space-y-4" onValueChange={handleTabChange}>
      <TabsList className="flex flex-col sm:grid sm:grid-cols-3 gap-2 bg-transparent h-auto p-0">
        <TabsTrigger 
          value="actions" 
          className="w-full data-[state=active]:bg-cuba-coral data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Actions
        </TabsTrigger>
        <TabsTrigger 
          value="gallery" 
          className="w-full data-[state=active]:bg-cuba-coral data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Album Photos
        </TabsTrigger>
        <TabsTrigger 
          value="statistics" 
          className="w-full data-[state=active]:bg-cuba-coral data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Statistiques
        </TabsTrigger>
      </TabsList>

      <TabsContent value="actions" className="mt-4">
        <DashboardActions onTabChange={handleTabChange} />
      </TabsContent>

      <TabsContent value="gallery" className="mt-4">
        <Card className="p-4">
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

      <TabsContent value="statistics" className="mt-4">
        <StatisticsSection />
      </TabsContent>
    </Tabs>
  );
};