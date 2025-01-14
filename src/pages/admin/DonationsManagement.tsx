import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Gift, Building2 } from "lucide-react";
import Donations from "@/pages/Donations";
import CitiesManagement from "@/pages/admin/CitiesManagement";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DonationsManagement() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t("donations")}</h1>
        
        <Tabs defaultValue="donations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donations" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              {t("donations")}
            </TabsTrigger>
            <TabsTrigger value="cities" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {t("cities")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donations">
            <Donations />
          </TabsContent>

          <TabsContent value="cities">
            <CitiesManagement />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}