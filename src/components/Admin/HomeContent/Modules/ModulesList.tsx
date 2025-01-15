import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ModuleCard } from "./ModuleCard";
import { Module } from "../types";

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
    id: "impact-stats",
    name: "Statistiques d'Impact",
    module_type: "impact-stats",
    is_active: false,
    settings: {
      title: "Notre Impact",
      showTotalSponsors: true,
      showTotalChildren: true,
      showTotalDonations: true,
      animateNumbers: true,
      backgroundStyle: "gradient"
    },
    order_index: 3
  },
  {
    id: "upcoming-events",
    name: "Événements à Venir",
    module_type: "events",
    is_active: false,
    settings: {
      title: "Nos Prochains Événements",
      displayCount: 3,
      showLocation: true,
      showDateTime: true,
      enableRegistration: true
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
    id: "sponsor-journey",
    name: "Parcours du Parrain",
    module_type: "journey",
    is_active: false,
    settings: {
      title: "Comment devenir parrain ?",
      steps: [
        { title: "Choisissez un enfant", description: "Parcourez les profils des enfants en attente" },
        { title: "Remplissez le formulaire", description: "Complétez vos informations" },
        { title: "Commencez l'aventure", description: "Démarrez votre parrainage" }
      ],
      showProgressBar: true
    },
    order_index: 6
  },
  {
    id: "success-stories",
    name: "Histoires de Réussite",
    module_type: "stories",
    is_active: false,
    settings: {
      title: "Histoires qui Inspirent",
      storiesCount: 3,
      showThumbnails: true,
      enableVideo: true,
      layout: "masonry"
    },
    order_index: 7
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
    order_index: 8
  },
  {
    id: "featured-children",
    name: "Enfants en Attente",
    module_type: "children-grid",
    is_active: false,
    settings: {
      title: "Ils Attendent un Parrain",
      childrenCount: 6,
      showAge: true,
      showLocation: true,
      showNeeds: true,
      enableFilters: true,
      layout: "grid"
    },
    order_index: 9
  },
  {
    id: "donation-progress",
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
    order_index: 10
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
    order_index: 11
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
  if (!modules || modules.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modules de la page d'accueil</h2>
          <Button variant="outline" onClick={onNewModuleClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un module
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="text-center py-4 text-gray-500 mb-8">
            Voici les modules disponibles que vous pouvez ajouter à votre page d'accueil :
          </div>

          <div className="space-y-4">
            {moduleExamples.map((example) => (
              <div key={example.id} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <h3 className="font-medium text-lg mb-2">{example.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Type: {example.module_type}</p>
                <div className="bg-white p-3 rounded-md">
                  <p className="text-sm font-medium mb-2">Paramètres disponibles :</p>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(example.settings, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button onClick={onNewModuleClick} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Créer mon premier module
            </Button>
          </div>
        </div>
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
                        onToggle={onToggle}
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