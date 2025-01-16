import { AdminPageLayout } from "@/components/Admin/AdminPageLayout";
import { AdminGrid } from "@/components/Admin/AdminGrid";
import { Users, Image } from "lucide-react";
import Children from "@/pages/Children";
import AssistantPhotos from "@/pages/AssistantPhotos";
import SponsorshipManagement from "./SponsorshipManagement";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ChildrenManagement() {
  const { t } = useLanguage();

  return (
    <AdminPageLayout>
      <div className="admin-header">
        <h1 className="text-2xl font-bold mb-4">{t("childrenAndSponsorship")}</h1>
      </div>
      <AdminGrid>
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
      </AdminGrid>
    </AdminPageLayout>
  );
}