import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Edit, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { DonationCardHeader } from "./DonationCardHeader";
import { DonationDetails } from "./DonationDetails";
import { DonationCardMedia } from "./DonationCardMedia";
import { useLanguage } from "@/contexts/LanguageContext";
import { PhotoUploadDialog as MediaPhotoUploadDialog } from "./Media/PhotoUploadDialog";
import { EditDonationDialog } from "./Dialogs/EditDonationDialog";
import { DeleteDonationDialog } from "./Dialogs/DeleteDonationDialog";
import { useDeleteDonation } from "./hooks/useDeleteDonation";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DonationCardProps {
  donation: any;
  isPublicView?: boolean;
  onDelete?: () => void;
  canDelete?: boolean;
}

export const DonationCard = ({ 
  donation, 
  isPublicView = false,
  onDelete,
  canDelete = false 
}: DonationCardProps) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();
  const { deleteDonation, isDeleting } = useDeleteDonation();

  const translations = {
    fr: {
      addPhotos: "Ajouter des photos",
      edit: "Modifier",
      delete: "Supprimer",
      deleteSuccess: "Don supprimé avec succès",
      deleteError: "Erreur lors de la suppression du don",
      closePhotos: "Fermer l'ajout de photos"
    },
    es: {
      addPhotos: "Agregar fotos",
      edit: "Modificar",
      delete: "Eliminar",
      deleteSuccess: "Donación eliminada con éxito",
      deleteError: "Error al eliminar la donación",
      closePhotos: "Cerrar agregar fotos"
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleDelete = async () => {
    try {
      await deleteDonation(donation.id);
      toast({
        title: t.deleteSuccess,
        variant: "default"
      });
      onDelete?.();
    } catch (error) {
      toast({
        title: t.deleteError,
        variant: "destructive"
      });
    }
    setShowDeleteDialog(false);
  };

  const handlePhotosUpdate = () => {
    onDelete?.();
  };

  const handleVideosUpdate = () => {
    onDelete?.();
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-6">
        <DonationCardHeader donation={donation} />
        <DonationDetails donation={donation} />
        <DonationCardMedia 
          donationId={donation.id}
          photos={donation.photos || []}
          videos={donation.videos || []}
          onPhotosUpdate={handlePhotosUpdate}
          onVideosUpdate={handleVideosUpdate}
          isPublicView={isPublicView}
        />
      </div>
      
      {!isPublicView && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
          <Collapsible open={showPhotoUpload} onOpenChange={setShowPhotoUpload}>
            <div className="flex justify-end space-x-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline">
                  {showPhotoUpload ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      {t.closePhotos}
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-4 h-4 mr-2" />
                      {t.addPhotos}
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <Button variant="outline" onClick={() => setShowEditDialog(true)}>
                <Edit className="w-4 h-4 mr-2" />
                {t.edit}
              </Button>
              {canDelete && (
                <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => setShowDeleteDialog(true)}>
                  <Trash className="w-4 h-4 mr-2" />
                  {t.delete}
                </Button>
              )}
            </div>
            <CollapsibleContent className="mt-4">
              <MediaPhotoUploadDialog 
                donationId={donation.id}
                onUploadComplete={handlePhotosUpdate}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      <EditDonationDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        donation={donation}
        onSuccess={() => {
          setShowEditDialog(false);
          onDelete?.();
        }}
      />

      <DeleteDonationDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </Card>
  );
};