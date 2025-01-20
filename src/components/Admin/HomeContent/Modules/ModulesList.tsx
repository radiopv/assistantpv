import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ModuleCard } from "./ModuleCard";
import { Module } from "../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ModulesListProps {
  modules: Module[];
  onDragEnd: (result: any) => void;
  onToggle: (moduleId: string, currentState: boolean) => void;
  onSettingsClick: (module: Module) => void;
  onDeleteClick: (moduleId: string) => void;
  onNewModuleClick: () => void;
}

const moduleExamples: Module[] = [
  {
    id: "hero-section",
    name: "Section Héros",
    module_type: "hero",
    is_active: true,
    settings: {
      title: "Parrainez un enfant cubain",
      subtitle: "Aidez-nous à changer des vies",
      buttonText: "Devenir parrain",
      buttonLink: "/become-sponsor",
      backgroundImage: "/path/to/image.jpg"
    },
    order_index: 0
  },
  {
    id: "testimonials-section",
    name: "Témoignages",
    module_type: "testimonials",
    is_active: true,
    settings: {
      title: "Ce que disent nos parrains",
      displayCount: 3,
      autoplay: true,
      showRatings: true,
      layout: "grid"
    },
    order_index: 1
  },
  {
    id: "featured-album",
    name: "Album Photos",
    module_type: "featured-album",
    is_active: true,
    settings: {
      title: "Moments partagés",
      photosCount: 6,
      showCaptions: true,
      autoSlide: true,
      layout: "carousel"
    },
    order_index: 2
  },
  {
    id: "events-section",
    name: "Événements à Venir",
    module_type: "events",
    is_active: false,
    settings: {
      title: "Nos Prochains Événements",
      displayCount: 3,
      showLocation: true,
      showDateTime: true,
      enableRegistration: true,
      layout: "cards"
    },
    order_index: 4
  },
  {
    id: "donation-needs",
    name: "Besoins en Dons",
    module_type: "needs",
    is_active: false,
    settings: {
      title: "Besoins Actuels",
      categoriesCount: 6,
      showUrgentFirst: true,
      enableDonationButton: true,
      layout: "cards"
    },
    order_index: 5
  },
  {
    id: "newsletter-signup",
    name: "Newsletter",
    module_type: "newsletter",
    is_active: false,
    settings: {
      title: "Restez Informé",
      subtitle: "Recevez nos actualités",
      buttonText: "S'inscrire",
      showSocialLinks: true,
      backgroundColor: "light"
    },
    order_index: 6
  },
  {
    id: "donation-goals",
    name: "Objectifs de Dons",
    module_type: "donation-goals",
    is_active: false,
    settings: {
      title: "Nos Objectifs",
      showProgressBars: true,
      enableDonationButton: true,
      showTargetAmount: true,
      categories: ["Éducation", "Santé", "Alimentation"]
    },
    order_index: 7
  },
  {
    id: "sponsor-community",
    name: "Communauté de Parrains",
    module_type: "community",
    is_active: false,
    settings: {
      title: "Notre Communauté",
      showMemberCount: true,
      displayTestimonials: true,
      enableJoinButton: true,
      layout: "modern"
    },
    order_index: 8
  }
];

export const ModulesList = ({
  modules,
  onDragEnd,
  onToggle,
  onSettingsClick,
  onDeleteClick,
  onNewModuleClick
}: ModulesListProps) => {
  const queryClient = useQueryClient();

  const { data: fetchedModules, isLoading, error } = useQuery({
    queryKey: ['homepage-modules'],
    queryFn: async () => {
      console.log('Fetching homepage modules...'); 

      try {
        const { data, error } = await supabase
          .from('homepage_modules')
          .select('*')
          .eq('is_active', true)
          .order('order_index');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data) {
          console.log('No data returned from Supabase');
          return [];
        }

        console.log('Raw data from Supabase:', data);
        return data;
      } catch (err) {
        console.error('Failed to fetch modules:', err);
        toast.error("Erreur lors du chargement des modules", {
          description: "Veuillez réessayer plus tard"
        });
        throw err;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const updateModuleStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      try {
        const { error } = await supabase
          .from('homepage_modules')
          .update({ is_active: isActive })
          .eq('id', id);

        if (error) throw error;
        return { id, isActive };
      } catch (err) {
        console.error('Error updating module status:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-modules'] });
      toast.success("Module mis à jour", {
        description: "Le statut du module a été mis à jour avec succès"
      });
    },
    onError: (error) => {
      console.error('Error updating module status:', error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la mise à jour du statut"
      });
    }
  });

  const handleToggle = (moduleId: string, currentState: boolean) => {
    updateModuleStatus.mutate({ id: moduleId, isActive: !currentState });
    onToggle(moduleId, currentState);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chargement des modules...</h2>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">
            Erreur lors du chargement des modules
          </h2>
        </div>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['homepage-modules'] })}>
          Réessayer
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Modules de la page d'accueil</h2>
        <Button variant="outline" onClick={onNewModuleClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un module
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="modules">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {modules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <ModuleCard
                        module={module}
                        onToggle={handleToggle}
                        onSettingsClick={onSettingsClick}
                        onDeleteClick={onDeleteClick}
                        dragHandleProps={provided.dragHandleProps}
                      />
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
  );
};