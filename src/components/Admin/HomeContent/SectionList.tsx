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

const defaultSections = [
  {
    id: "hero",
    section_key: "hero",
    title: "Parrainez un enfant cubain",
    subtitle: "Aidez-nous à changer des vies en parrainant un enfant cubain dans le besoin",
    order_index: 0
  },
  {
    id: "featured-children",
    section_key: "featured-children",
    title: "Enfants en attente de parrainage",
    subtitle: "Découvrez les enfants qui attendent votre soutien",
    order_index: 1
  },
  {
    id: "how-it-works",
    section_key: "how-it-works",
    title: "Comment ça marche",
    subtitle: "Découvrez le processus simple pour devenir parrain",
    order_index: 2
  },
  {
    id: "testimonials",
    section_key: "testimonials",
    title: "Témoignages",
    subtitle: "Ce que disent nos parrains",
    order_index: 3
  }
];

export const SectionList = ({ sections = [] }: SectionListProps) => {
  const queryClient = useQueryClient();
  const displaySections = sections.length > 0 ? sections : defaultSections;

  const updateSection = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('homepage_sections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return { id, updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-sections'] });
      toast("Section mise à jour", {
        description: "Le contenu a été mis à jour avec succès"
      });
    },
    onError: (error) => {
      toast("Erreur", {
        description: "Une erreur est survenue lors de la mise à jour",
        style: { backgroundColor: 'red', color: 'white' }
      });
      console.error('Error updating section:', error);
    }
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(displaySections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update all affected sections with new order_index values
    for (let i = 0; i < items.length; i++) {
      try {
        await updateSection.mutateAsync({
          id: items[i].id,
          updates: { order_index: i }
        });
      } catch (error) {
        console.error('Error updating section order:', error);
        toast("Erreur", {
          description: "Une erreur est survenue lors de la réorganisation",
          style: { backgroundColor: 'red', color: 'white' }
        });
        return;
      }
    }

    toast("Ordre mis à jour", {
      description: "L'ordre des sections a été mis à jour avec succès"
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {displaySections.map((section, index) => (
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