import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Gift, Building2 } from "lucide-react";
import Donations from "@/pages/Donations";
import CitiesManagement from "@/pages/admin/CitiesManagement";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DonationsManagement() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white">
      <div className="container mx-auto p-0 sm:p-4 space-y-4">
        <Card className="bg-white/80 backdrop-blur-sm rounded-none sm:rounded-xl shadow-lg p-4 sm:p-6 border border-orange-200">
          <h1 className="text-xl sm:text-2xl font-bold mb-6">{t("donations")}</h1>
          
          <Tabs defaultValue="donations" className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-2">
              <TabsTrigger value="donations" className="flex items-center gap-2 min-h-[44px]">
                <Gift className="w-4 h-4" />
                <span className="hidden sm:inline">{t("donations")}</span>
                <span className="sm:hidden">Dons</span>
              </TabsTrigger>
              <TabsTrigger value="cities" className="flex items-center gap-2 min-h-[44px]">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t("cities")}</span>
                <span className="sm:hidden">Villes</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donations" className="mt-4">
              <Donations />
            </TabsContent>

            <TabsContent value="cities" className="mt-4">
              <CitiesManagement />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}