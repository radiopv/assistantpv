import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DonationCategories } from "./DonationCategories";
import { DonationInfo } from "./DonationInfo";
import { DonationDonors } from "./DonationDonors";
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
import { useLanguage } from "@/contexts/LanguageContext";

interface DonationCardProps {
  donation: any;
  onDelete?: () => void;
  canDelete?: boolean;
}

export const DonationCard = ({ donation, onDelete, canDelete }: DonationCardProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    fr: {
      deleteConfirmTitle: "Êtes-vous sûr ?",
      deleteConfirmDescription: "Cette action ne peut pas être annulée. Le don sera définitivement supprimé.",
      cancel: "Annuler",
      confirm: "Confirmer",
      deletionError: "Une erreur est survenue lors de la suppression",
      deletionSuccess: "Don supprimé avec succès"
    },
    es: {
      deleteConfirmTitle: "¿Está seguro?",
      deleteConfirmDescription: "Esta acción no se puede deshacer. La donación se eliminará permanentemente.",
      cancel: "Cancelar",
      confirm: "Confirmar",
      deletionError: "Ocurrió un error durante la eliminación",
      deletionSuccess: "Donación eliminada con éxito"
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', donation.id);

      if (error) throw error;

      toast({
        title: t.deletionSuccess,
      });

      onDelete?.();
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast({
        variant: "destructive",
        title: t.deletionError,
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <DonationInfo donation={donation} />
        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.deleteConfirmDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  {t.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DonationCategories items={donation.items} />
          <DonationDonors donors={donation.donors} />
          
          {donation.photos && donation.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {donation.photos.map((photo: any, index: number) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={photo.url}
                    alt={photo.title || `Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};