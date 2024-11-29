import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChildrenHeaderProps {
  onAddChild: () => void;
}

export const ChildrenHeader = ({ onAddChild }: ChildrenHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Enfants</h1>
        <p className="text-gray-600 mt-2">Gérez les enfants et leurs besoins</p>
      </div>
      <Button onClick={onAddChild}>
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un enfant
      </Button>
    </div>
  );
};