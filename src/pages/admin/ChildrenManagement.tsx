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
    <div className="container mx-auto p-4 space-y-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t("childrenAndSponsorship")}</h1>
        
        <Tabs defaultValue="children" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="children" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("children")}
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              {t("photos")}
            </TabsTrigger>
            <TabsTrigger value="sponsorship" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("sponsorshipManagement")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children">
            <Children />
          </TabsContent>

          <TabsContent value="photos">
            <AssistantPhotos />
          </TabsContent>

          <TabsContent value="sponsorship">
            <SponsorshipManagement />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}