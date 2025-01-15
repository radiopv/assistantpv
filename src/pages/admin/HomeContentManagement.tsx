import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/Admin/HomeContent/ImageUpload";
import { SectionList } from "@/components/Admin/HomeContent/SectionList";
import { ModulesList } from "@/components/Admin/HomeContent/Modules/ModulesList";
import { ModuleDialog } from "@/components/Admin/HomeContent/Modules/ModuleDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";
import { Module } from "@/components/Admin/HomeContent/types";

const HomeContentManagement = () => {
  const queryClient = useQueryClient();
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewModuleOpen, setIsNewModuleOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    name: "",
    module_type: "",
    settings: {}
  });

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
      queryClient.invalidateQueries({ queryKey: ['homepage-modules'] });
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

  const deleteModule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('homepage_modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-modules'] });
      toast("Module supprimé", {
        description: "Le module a été supprimé avec succès"
      });
    },
    onError: (error) => {
      console.error('Error deleting module:', error);
      toast("Erreur", {
        description: "Une erreur est survenue lors de la suppression",
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
  });

  const createModule = useMutation({
    mutationFn: async (moduleData: Omit<Module, 'id'>) => {
      const { error } = await supabase
        .from('homepage_modules')
        .insert([moduleData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-modules'] });
      setIsNewModuleOpen(false);
      setNewModule({ name: "", module_type: "", settings: {} });
      toast("Module créé", {
        description: "Le nouveau module a été créé avec succès"
      });
    },
    onError: (error) => {
      console.error('Error creating module:', error);
      toast("Erreur", {
        description: "Une erreur est survenue lors de la création",
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !modules) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      updates: { order_index: index }
    }));

    try {
      for (const update of updates) {
        await updateModule.mutateAsync(update);
      }

      toast("Ordre mis à jour", {
        description: "L'ordre des modules a été mis à jour avec succès"
      });
    } catch (error) {
      console.error('Error reordering modules:', error);
      toast("Erreur", {
        description: "Une erreur est survenue lors de la réorganisation",
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
  };

  const handleModuleToggle = (moduleId: string, currentState: boolean) => {
    updateModule.mutate({
      id: moduleId,
      updates: { is_active: !currentState }
    });
  };

  const handleSettingsSave = () => {
    if (!editingModule) return;
    
    updateModule.mutate({
      id: editingModule.id,
      updates: { settings: editingModule.settings }
    });
    setIsSettingsOpen(false);
  };

  const handleNewModuleSave = () => {
    createModule.mutate({
      ...newModule,
      is_active: true,
      order_index: modules?.length || 0
    });
  };

  if (isHeroLoading || isSectionsLoading || isModulesLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
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
          <ModulesList
            modules={modules || []}
            onDragEnd={handleDragEnd}
            onToggle={handleModuleToggle}
            onSettingsClick={(module) => {
              setEditingModule(module);
              setIsSettingsOpen(true);
            }}
            onDeleteClick={(moduleId) => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
                deleteModule.mutate(moduleId);
              }
            }}
            onNewModuleClick={() => setIsNewModuleOpen(true)}
          />

          <ModuleDialog
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
            module={editingModule}
            onSave={handleSettingsSave}
            onChange={(field, value) => {
              setEditingModule(prev => prev ? { ...prev, [field]: value } : null);
            }}
          />

          <ModuleDialog
            open={isNewModuleOpen}
            onOpenChange={setIsNewModuleOpen}
            module={newModule as Module}
            isNew
            onSave={handleNewModuleSave}
            onChange={(field, value) => {
              setNewModule(prev => ({ ...prev, [field]: value }));
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeContentManagement;