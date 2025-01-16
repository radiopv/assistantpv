import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, Image } from "lucide-react";
import Children from "@/pages/Children";
import AssistantPhotos from "@/pages/AssistantPhotos";
import SponsorshipManagement from "./SponsorshipManagement";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ChildrenManagement() {
  const { t } = useLanguage();

  return (
    <div className="w-full p-2 sm:p-4 space-y-4">
      <Card className="p-4 sm:p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Gestion des enfants et parrainages</h1>
        
        <Tabs defaultValue="children" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
            <TabsTrigger 
              value="children" 
              className="flex items-center gap-2 min-h-[44px] w-full justify-center"
            >
              <Users className="w-4 h-4" />
              Enfants
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              className="flex items-center gap-2 min-h-[44px] w-full justify-center"
            >
              <Image className="w-4 h-4" />
              Photos
            </TabsTrigger>
            <TabsTrigger 
              value="sponsorship" 
              className="flex items-center gap-2 min-h-[44px] w-full justify-center"
            >
              <Users className="w-4 h-4" />
              Parrainages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children" className="mt-2">
            <Children />
          </TabsContent>

          <TabsContent value="photos" className="mt-2">
            <AssistantPhotos />
          </TabsContent>

          <TabsContent value="sponsorship" className="mt-2">
            <SponsorshipManagement />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}