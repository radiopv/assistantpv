import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, Image } from "lucide-react";
import Children from "@/pages/Children";
import AssistantPhotos from "@/pages/AssistantPhotos";
import SponsorshipManagement from "./SponsorshipManagement";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { AssignSponsorDialog } from "@/components/AssistantSponsorship/AssignSponsorDialog";

export default function ChildrenManagement() {
  const { t } = useLanguage();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      <div className="container mx-auto p-0 sm:p-4 space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm rounded-none sm:rounded-xl shadow-lg p-4 sm:p-6 border border-orange-200">
          <h1 className="text-2xl font-bold mb-4">{t("childrenAndSponsorship")}</h1>
          
          <Tabs defaultValue="children" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <TabsTrigger 
                value="children" 
                className="flex items-center gap-2 min-h-[44px] w-full justify-center"
              >
                <Users className="w-4 h-4" />
                {t("children")}
              </TabsTrigger>
              <TabsTrigger 
                value="photos" 
                className="flex items-center gap-2 min-h-[44px] w-full justify-center"
              >
                <Image className="w-4 h-4" />
                {t("photos")}
              </TabsTrigger>
              <TabsTrigger 
                value="sponsorship" 
                className="flex items-center gap-2 min-h-[44px] w-full justify-center"
              >
                <Users className="w-4 h-4" />
                {t("sponsorshipManagement")}
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

      <AssignSponsorDialog
        isOpen={!!selectedChildId}
        onClose={() => setSelectedChildId(null)}
        childId={selectedChildId || ""}
        onAssignComplete={() => {
          // Refresh data after assignment
          window.location.reload();
        }}
      />
    </div>
  );
}