import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/Admin/HomeContent/ImageUpload";
import { SectionList } from "@/components/Admin/HomeContent/SectionList";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

  const updateModule = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      const { error } = await supabase
        .from('homepage_modules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast("Module mis à jour", {
        description: "Les modifications ont été enregistrées avec succès"
      });
    },
    onError: (error) => {
      console.error('Error updating module:', error);
      toast("Erreur", {
        description: "Une erreur est survenue lors de la mise à jour",
        style: { backgroundColor: 'red', color: 'white' }
      });
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

  const handleModuleToggle = (moduleId: string, currentState: boolean) => {
    updateModule.mutate({
      id: moduleId,
      updates: { is_active: !currentState }
    });
  };

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
            <div className="space-y-4">
              {modules?.map((module) => (
                <div key={module.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{module.name}</h3>
                      <p className="text-sm text-gray-500">Type: {module.module_type}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`module-${module.id}`}
                          checked={module.is_active}
                          onCheckedChange={() => handleModuleToggle(module.id, module.is_active)}
                        />
                        <Label htmlFor={`module-${module.id}`}>
                          {module.is_active ? 'Actif' : 'Inactif'}
                        </Label>
                      </div>
                    </div>
                  </div>
                  {module.settings && Object.keys(module.settings).length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Paramètres</h4>
                      <pre className="text-sm bg-gray-50 p-2 rounded">
                        {JSON.stringify(module.settings, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeContentManagement;