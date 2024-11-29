import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfileHeaderProps {
  name: string;
  editing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  showEditButtons?: boolean;
}

export const ProfileHeader = ({ 
  name, 
  editing, 
  onBack, 
  onEdit, 
  onSave, 
  onDelete,
  showEditButtons = true
}: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {name}
        </h1>
      </div>
      {showEditButtons && (
        <div className="flex gap-2">
          <Button 
            variant={editing ? "outline" : "default"}
            onClick={() => editing ? onSave() : onEdit()}
          >
            {editing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </>
            ) : (
              "Modifier"
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet enfant ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes les informations associées à cet enfant seront définitivement supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};