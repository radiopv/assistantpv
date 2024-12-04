import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailableChildrenList } from "@/components/Sponsorship/AvailableChildrenList";
import { SponsoredChildrenList } from "@/components/Sponsorship/SponsoredChildrenList";
import { Loader2 } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface Child {
  id: string;
  name: string;
  age: number;
  city: string | null;
  gender: 'male' | 'female';
  photo_url: string | null;
  is_sponsored: boolean;
  needs: {
    category: string;
    is_urgent: boolean;
  }[];
  sponsors: {
    name: string;
    email: string;
    photo_url: string | null;
  } | null;
}

interface NeedJson {
  category?: string;
  is_urgent?: boolean;
}

const SponsorshipManagement = () => {
  const { data: children, isLoading } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          sponsorships (
            sponsors (
              name,
              email,
              photo_url
            )
          )
        `)
        .order('name');

      if (error) throw error;
      
      return data?.map(child => {
        // Get sponsor from sponsorship if exists
        const sponsor = child.sponsorships?.[0]?.sponsors || null;
        
        // Transform needs from Json to typed array
        const needs = Array.isArray(child.needs) 
          ? child.needs.map(need => {
              const needObj = need as NeedJson;
              return {
                category: String(needObj?.category || ''),
                is_urgent: Boolean(needObj?.is_urgent || false)
              };
            })
          : [];

        return {
          ...child,
          gender: child.gender.toLowerCase() as 'male' | 'female',
          needs,
          sponsors: sponsor
        };
      }) as Child[];
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