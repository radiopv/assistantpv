import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/Admin/HomeContent/ImageUpload";
import { SectionList } from "@/components/Admin/HomeContent/SectionList";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Trash2, GripVertical, Settings, Plus } from "lucide-react";

interface Module {
  id: string;
  name: string;
  module_type: string;
  is_active: boolean;
  settings: any;
  order_index: number;
}

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

    // Update all affected modules with new order_index values
    const updates = items.map((item, index) => ({
      id: item.id,
      updates: { order_index: index }
    }));

    try {
      // Execute all updates in sequence
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Modules de la page d'accueil</h2>
              <Dialog open={isNewModuleOpen} onOpenChange={setIsNewModuleOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un module
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouveau module</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        value={newModule.name}
                        onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Input
                        id="type"
                        value={newModule.module_type}
                        onChange={(e) => setNewModule({ ...newModule, module_type: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="settings">Paramètres (JSON)</Label>
                      <Textarea
                        id="settings"
                        value={JSON.stringify(newModule.settings, null, 2)}
                        onChange={(e) => {
                          try {
                            const settings = JSON.parse(e.target.value);
                            setNewModule({ ...newModule, settings });
                          } catch (error) {
                            console.error('Invalid JSON:', error);
                          }
                        }}
                      />
                    </div>
                    <Button onClick={handleNewModuleSave}>Créer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="modules">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {modules?.map((module, index) => (
                      <Draggable key={module.id} draggableId={module.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="p-4 border rounded-lg bg-white"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="text-gray-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-lg">{module.name}</h3>
                                  <p className="text-sm text-gray-500">Type: {module.module_type}</p>
                                </div>
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
                                <Dialog open={isSettingsOpen && editingModule?.id === module.id} onOpenChange={(open) => {
                                  setIsSettingsOpen(open);
                                  if (!open) setEditingModule(null);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => setEditingModule(module)}
                                    >
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Paramètres du module</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <Textarea
                                        value={editingModule ? JSON.stringify(editingModule.settings, null, 2) : ''}
                                        onChange={(e) => {
                                          try {
                                            const settings = JSON.parse(e.target.value);
                                            setEditingModule(prev => prev ? { ...prev, settings } : null);
                                          } catch (error) {
                                            console.error('Invalid JSON:', error);
                                          }
                                        }}
                                        className="font-mono"
                                      />
                                      <Button onClick={handleSettingsSave}>Enregistrer</Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
                                      deleteModule.mutate(module.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeContentManagement;