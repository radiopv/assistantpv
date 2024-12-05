import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, GripVertical } from "lucide-react";
import { HomeModule } from "@/types/homepage-modules";
import { ModuleEditor } from "@/components/Admin/HomeModules/ModuleEditor";

const HomeModules = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedModule, setSelectedModule] = useState<HomeModule | null>(null);

  const { data: modules, isLoading } = useQuery({
    queryKey: ['homepage-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_modules')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as HomeModule[];
    }
  });

  const updateModuleMutation = useMutation({
    mutationFn: async (module: HomeModule) => {
      const { error } = await supabase
        .from('homepage_modules')
        .update({
          name: module.name,
          is_active: module.is_active,
          content: module.content,
          order_index: module.order_index,
          module_type: module.module_type,
          settings: module.settings
        })
        .eq('id', module.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-modules'] });
      toast({
        title: "Module mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
      console.error('Error updating module:', error);
    }
  });

  const reorderModulesMutation = useMutation({
    mutationFn: async (updates: { id: string; order_index: number; module_type: string; name: string }[]) => {
      const { error } = await supabase
        .from('homepage_modules')
        .upsert(updates);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-modules'] });
      toast({
        title: "Ordre mis à jour",
        description: "L'ordre des modules a été mis à jour avec succès.",
      });
    }
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination || !modules) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      order_index: index + 1,
      module_type: item.module_type,
      name: item.name
    }));

    reorderModulesMutation.mutate(updates);
  };

  const toggleModuleActive = (module: HomeModule) => {
    updateModuleMutation.mutate({
      ...module,
      is_active: !module.is_active
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Modules de la Page d'Accueil</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {modules?.map((module, index) => (
                <Draggable
                  key={module.id}
                  draggableId={module.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          <h3 className="font-medium">{module.name}</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Switch
                            checked={module.is_active}
                            onCheckedChange={() => toggleModuleActive(module)}
                          />
                          <Button
                            variant="outline"
                            onClick={() => setSelectedModule(module)}
                          >
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {selectedModule && (
        <ModuleEditor
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onSave={(updatedModule) => {
            updateModuleMutation.mutate(updatedModule);
            setSelectedModule(null);
          }}
        />
      )}
    </div>
  );
};

export default HomeModules;