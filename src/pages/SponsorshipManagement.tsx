import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailableChildrenList } from "@/components/Sponsorship/AvailableChildrenList";
import { SponsoredChildrenList } from "@/components/Sponsorship/SponsoredChildrenList";
import { Loader2 } from "lucide-react";

const SponsorshipManagement = () => {
  const { data: children, isLoading } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          sponsorships (
            sponsor:sponsors (
              name,
              email,
              photo_url
            )
          )
        `)
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const sponsoredChildren = children?.filter(child => child.is_sponsored) || [];
  const availableChildren = children?.filter(child => !child.is_sponsored) || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Parrainages</h1>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">
            Enfants Disponibles ({availableChildren.length})
          </TabsTrigger>
          <TabsTrigger value="sponsored">
            Enfants Parrainés ({sponsoredChildren.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <Card className="p-4">
            <AvailableChildrenList children={availableChildren} />
          </Card>
        </TabsContent>

        <TabsContent value="sponsored" className="mt-6">
          <Card className="p-4">
            <SponsoredChildrenList children={sponsoredChildren} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorshipManagement;