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
}

export const DonationCardHeader = ({
  donation,
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
    </div>
  );
};