import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Trash2, GripVertical } from "lucide-react";
import { Module } from "../types";

interface ModuleCardProps {
  module: Module;
  onToggle: (moduleId: string, currentState: boolean) => void;
  onSettingsClick: (module: Module) => void;
  onDeleteClick: (moduleId: string) => void;
  dragHandleProps: any;
}

export const ModuleCard = ({ 
  module, 
  onToggle, 
  onSettingsClick, 
  onDeleteClick,
  dragHandleProps 
}: ModuleCardProps) => {
  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div {...dragHandleProps}>
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
              onCheckedChange={() => onToggle(module.id, module.is_active)}
            />
            <Label htmlFor={`module-${module.id}`}>
              {module.is_active ? 'Actif' : 'Inactif'}
            </Label>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSettingsClick(module)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDeleteClick(module.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};