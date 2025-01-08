import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/Admin/HomeContent/ImageUpload";
import { SectionList } from "@/components/Admin/HomeContent/SectionList";

const HomeContentManagement = () => {
  const { data: heroImage, isLoading: isHeroLoading } = useQuery({
    queryKey: ['home-hero-image'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_images')
        .select('*')
        .eq('position', 'hero')
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: sections, isLoading: isSectionsLoading } = useQuery({
    queryKey: ['homepage-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('order_index');

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Gestion du contenu de la page d'accueil</h1>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList>
          <TabsTrigger value="hero">Image Principale</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <ImageUpload 
            heroImage={heroImage} 
            isLoading={isHeroLoading} 
          />
        </TabsContent>

        <TabsContent value="content">
          {!isSectionsLoading && sections && (
            <SectionList sections={sections} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeContentManagement;