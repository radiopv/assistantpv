import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { DonationHeader } from "./DonationHeader";
import { useLanguage } from "@/contexts/LanguageContext";
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

interface DonationCardHeaderProps {
  donation: {
    id: string;
    assistant_name: string;
    city: string;
    people_helped: number;
    donation_date: string;
    status: string;
  };
  isAdmin?: boolean;
  canDelete?: boolean;
  onEdit: () => void;
  onDelete?: () => void;
}

export const DonationCardHeader = ({
  donation,
  isAdmin,
  canDelete,
  onEdit,
  onDelete,
}: DonationCardHeaderProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      edit: "Modifier",
      delete: "Supprimer",
      areYouSure: "Êtes-vous sûr ?",
      deleteWarning: "Cette action est irréversible. Le don et toutes les données associées seront définitivement supprimés.",
      cancel: "Annuler",
      confirm: "Confirmer"
    },
    es: {
      edit: "Editar",
      delete: "Eliminar",
      areYouSure: "¿Está seguro?",
      deleteWarning: "Esta acción es irreversible. La donación y todos los datos asociados se eliminarán permanentemente.",
      cancel: "Cancelar",
      confirm: "Confirmar"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
      <DonationHeader donation={donation} />
      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-2 flex-1 sm:flex-initial"
        >
          <Edit className="w-4 h-4" />
          {t.edit}
        </Button>
        {(isAdmin || canDelete) && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-2 flex-1 sm:flex-initial"
              >
                <Trash2 className="w-4 h-4" />
                {t.delete}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.areYouSure}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.deleteWarning}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="w-full sm:w-auto">{t.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="w-full sm:w-auto">
                  {t.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};