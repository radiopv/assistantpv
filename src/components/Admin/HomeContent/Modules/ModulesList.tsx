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
        <div className="text-center py-8 text-gray-500">
          Aucun module n'a été créé. Cliquez sur "Ajouter un module" pour commencer.
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