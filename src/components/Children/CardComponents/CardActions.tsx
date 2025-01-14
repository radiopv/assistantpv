import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface CardActionsProps {
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onLearnMore: (e: React.MouseEvent) => void;
}

export const CardActions = ({ 
  editing, 
  onEdit, 
  onSave, 
  onCancel,
  onLearnMore
}: CardActionsProps) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    onEdit();
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave();
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel();
  };

  return (
    <div className="flex flex-col items-center gap-2" onClick={e => e.stopPropagation()}>
      {editing ? (
        <>
          <Button 
            className="w-full sm:w-3/4 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSaveClick}
          >
            Enregistrer
          </Button>
          <Button 
            className="w-full sm:w-3/4 bg-gray-100 hover:bg-gray-200 text-gray-900"
            onClick={handleCancelClick}
          >
            Annuler
          </Button>
        </>
      ) : (
        <>
          <Button 
            className="w-full sm:w-3/4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200" 
            variant="outline"
            onClick={handleEditClick}
          >
            Modifier
          </Button>
          <Button
            className="w-full sm:w-3/4 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
            onClick={onLearnMore}
          >
            <Info className="h-4 w-4" />
            En savoir plus
          </Button>
        </>
      )}
    </div>
  );
};