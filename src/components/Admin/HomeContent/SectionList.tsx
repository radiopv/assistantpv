import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Section {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  order_index: number;
}

interface SectionListProps {
  sections: Section[];
}

export const SectionList = ({ sections }: SectionListProps) => {
  const queryClient = useQueryClient();

  const updateSection = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('homepage_sections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-sections'] });
      toast({
        title: "Section mise à jour",
        description: "Le contenu a été mis à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
      });
      console.error('Error updating section:', error);
    }
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for all affected items
    const updates = items.map((item, index) => ({
      id: item.id,
      order_index: index
    }));

    try {
      await Promise.all(
        updates.map(({ id, order_index }) =>
          updateSection.mutateAsync({ id, updates: { order_index } })
        )
      );
    } catch (error) {
      console.error('Error reordering sections:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {sections.map((section, index) => (
              <Draggable key={section.id} draggableId={section.id} index={index}>
                {(provided) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="text-gray-400" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <h3 className="text-lg font-semibold">{section.section_key}</h3>
                        <Input
                          placeholder="Titre"
                          value={section.title || ''}
                          onChange={(e) => updateSection.mutate({
                            id: section.id,
                            updates: { title: e.target.value }
                          })}
                        />
                        <Input
                          placeholder="Sous-titre"
                          value={section.subtitle || ''}
                          onChange={(e) => updateSection.mutate({
                            id: section.id,
                            updates: { subtitle: e.target.value }
                          })}
                        />
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
  );
};