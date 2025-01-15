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
    id: "example-1",
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
    id: "example-2",
    name: "Témoignages",
    module_type: "testimonials",
    is_active: true,
    settings: {
      title: "Ce que disent nos parrains",
      displayCount: 3,
      autoplay: true,
      showRatings: true
    },
    order_index: 1
  },
  {
    id: "example-3",
    name: "Album Photos",
    module_type: "featured-album",
    is_active: true,
    settings: {
      title: "Moments partagés",
      photosCount: 6,
      showCaptions: true,
      autoSlide: true
    },
    order_index: 2
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
            Aucun module n'a été créé. Voici quelques exemples de modules que vous pouvez créer :
          </div>

          <div className="space-y-4">
            {moduleExamples.map((example) => (
              <div key={example.id} className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium text-lg mb-2">{example.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Type: {example.module_type}</p>
                <div className="bg-white p-3 rounded-md">
                  <p className="text-sm font-medium mb-2">Exemple de paramètres :</p>
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