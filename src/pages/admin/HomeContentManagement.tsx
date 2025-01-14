import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/Admin/HomeContent/ImageUpload";
import { SectionList } from "@/components/Admin/HomeContent/SectionList";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const HomeContentManagement = () => {
  const { data: heroImage, isLoading: isHeroLoading } = useQuery({
    queryKey: ['home-hero-image'],
    queryFn: async () => {
      console.log("Fetching hero image...");
      const { data, error } = await supabase
        .from('home_images')
        .select('*')
        .eq('position', 'hero')
        .maybeSingle();

      if (error) {
        console.error("Error fetching hero image:", error);
        throw error;
      }
      
      console.log("Hero image data:", data);
      return data;
    }
  });

  const { data: sections, isLoading: isSectionsLoading } = useQuery({
    queryKey: ['homepage-sections'],
    queryFn: async () => {
      console.log("Fetching homepage sections...");
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('order_index');

      if (error) {
        console.error("Error fetching sections:", error);
        throw error;
      }

      console.log("Homepage sections:", data);
      return data;
    }
  });

  const { data: modules, isLoading: isModulesLoading } = useQuery({
    queryKey: ['homepage-modules'],
    queryFn: async () => {
      console.log("Fetching homepage modules...");
      const { data, error } = await supabase
        .from('homepage_modules')
        .select('*')
        .order('order_index');

      if (error) {
        console.error("Error fetching modules:", error);
        throw error;
      }

      console.log("Homepage modules:", data);
      return data;
    }
  });

  if (isHeroLoading || isSectionsLoading || isModulesLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-8 w-64" />
        <Card className="p-6">
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Gestion du contenu de la page d'accueil</h1>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="hero">Image Principale</TabsTrigger>
          <TabsTrigger value="content">Sections</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
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

        <TabsContent value="modules">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Modules de la page d'accueil</h2>
            {modules?.map((module) => (
              <div key={module.id} className="p-4 border-b last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{module.name}</h3>
                    <p className="text-sm text-gray-500">Type: {module.module_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      module.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {module.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeContentManagement;