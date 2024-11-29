import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
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

interface DonationListItemProps {
  donation: {
    id: string;
    assistant_name: string;
    city: string;
    people_helped: number;
    donation_date: string;
    comments?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const DonationListItem = ({ donation, onEdit, onDelete }: DonationListItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {format(new Date(donation.donation_date), "d MMMM yyyy", { locale: fr })}
          </span>
          <span className="font-medium">{donation.city}</span>
          <span className="text-sm">{donation.assistant_name}</span>
          <span className="text-sm text-gray-600">
            {donation.people_helped} personnes aidées
          </span>
        </div>
        {donation.comments && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
            {donation.comments}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Modifier
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le don et toutes les données
                associées seront définitivement supprimés.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};