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
    <div className="w-full p-0 space-y-2">
      <Card className="p-2 sm:p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Gestion des enfants et parrainages</h1>
        
        <Tabs defaultValue="children" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
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

          <TabsContent value="children" className="mt-2 px-0">
            <Children />
          </TabsContent>

          <TabsContent value="photos" className="mt-2 px-0">
            <AssistantPhotos />
          </TabsContent>

          <TabsContent value="sponsorship" className="mt-2 px-0">
            <SponsorshipManagement />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}