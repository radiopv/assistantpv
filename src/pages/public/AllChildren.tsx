import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import AvailableChildren from "./AvailableChildren";
import SponsoredChildren from "./SponsoredChildren";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AllChildren() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      <div className="container mx-auto px-4 py-12 space-y-12">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-8 rounded-xl shadow-lg text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold font-title mb-4">
            Les Enfants
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Découvrez les enfants qui attendent votre soutien et ceux qui ont déjà trouvé une famille de cœur
          </p>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger 
                value="available" 
                className="text-lg py-4 data-[state=active]:bg-orange-100"
              >
                Enfants disponibles
              </TabsTrigger>
              <TabsTrigger 
                value="sponsored" 
                className="text-lg py-4 data-[state=active]:bg-orange-100"
              >
                Enfants parrainés
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="mt-6">
              <AvailableChildren />
            </TabsContent>

            <TabsContent value="sponsored" className="mt-6">
              <SponsoredChildren />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}