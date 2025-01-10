import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface DeleteDonationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteDonationDialog = ({ open, onClose, onConfirm, isDeleting }: DeleteDonationDialogProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Êtes-vous sûr ?",
      description: "Cette action ne peut pas être annulée. Cela supprimera définitivement ce don et toutes les photos associées.",
      cancel: "Annuler",
      confirm: "Supprimer"
    },
    es: {
      title: "¿Estás seguro?",
      description: "Esta acción no se puede deshacer. Eliminará permanentemente esta donación y todas las fotos asociadas.",
      cancel: "Cancelar",
      confirm: "Eliminar"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {t.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};