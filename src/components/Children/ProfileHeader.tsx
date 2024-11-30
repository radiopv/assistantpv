import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2, Globe } from "lucide-react";
import { useState } from "react";
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

const translations = {
  fr: {
    back: "Retour",
    edit: "Modifier",
    save: "Enregistrer",
    delete: "Supprimer",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cet enfant ?",
    deleteDescription: "Cette action est irréversible. Toutes les informations associées à cet enfant seront définitivement supprimées.",
    cancel: "Annuler",
    confirmDeleteButton: "Supprimer"
  },
  es: {
    back: "Volver",
    edit: "Editar",
    save: "Guardar",
    delete: "Eliminar",
    confirmDelete: "¿Está seguro de que desea eliminar a este niño?",
    deleteDescription: "Esta acción es irreversible. Toda la información asociada con este niño será eliminada permanentemente.",
    cancel: "Cancelar",
    confirmDeleteButton: "Eliminar"
  }
};

interface ProfileHeaderProps {
  name: string;
  editing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export const ProfileHeader = ({ 
  name, 
  editing, 
  onBack, 
  onEdit, 
  onSave, 
  onDelete 
}: ProfileHeaderProps) => {
  const [language, setLanguage] = useState<"fr" | "es">("fr");

  const toggleLanguage = () => {
    setLanguage(prev => prev === "fr" ? "es" : "fr");
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {translations[language].back}
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {name}
        </h1>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleLanguage}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {language.toUpperCase()}
        </Button>
        <Button 
          variant={editing ? "outline" : "default"}
          onClick={() => editing ? onSave() : onEdit()}
        >
          {editing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              {translations[language].save}
            </>
          ) : (
            translations[language].edit
          )}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              {translations[language].delete}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{translations[language].confirmDelete}</AlertDialogTitle>
              <AlertDialogDescription>
                {translations[language].deleteDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{translations[language].cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {translations[language].confirmDeleteButton}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};