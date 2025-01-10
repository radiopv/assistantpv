import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Camera } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DonationCardHeader } from "./DonationCardHeader";
import { DonationCardMedia } from "./DonationCardMedia";
import { DonationDialog } from "./DonationDialog";
import { PhotoUploadDialog } from "./Media/PhotoUploadDialog";

interface DonationCardProps {
  donation: any;
  onDelete?: () => void;
  canDelete?: boolean;
}

export const DonationCard = ({ donation, onDelete, canDelete = false }: DonationCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', donation.id);

      if (error) throw error;

      toast({
        title: "Don supprimé",
        description: "Le don a été supprimé avec succès.",
      });

      onDelete?.();
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du don.",
      });
    }
  };

  const handlePhotosUpdate = () => {
    setShowPhotoDialog(false);
    onDelete?.(); // Refresh the list
  };

  const handleSave = async (updatedDonation: any) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update(updatedDonation)
        .eq('id', donation.id);

      if (error) throw error;

      toast({
        title: "Don mis à jour",
        description: "Le don a été mis à jour avec succès.",
      });

      setShowEditDialog(false);
      onDelete?.(); // Refresh the list
    } catch (error) {
      console.error('Error updating donation:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du don.",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <DonationCardHeader donation={donation} />
      
      <div className="p-4 space-y-4">
        <DonationCardMedia 
          donationId={donation.id}
          photos={donation.photos || []}
          videos={[]}
          onPhotosUpdate={handlePhotosUpdate}
          onVideosUpdate={() => {}}
        />

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {format(new Date(donation.donation_date), "d MMMM yyyy", { locale: fr })}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPhotoDialog(true)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Photos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            {canDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        </div>

        {donation.comments && (
          <p className="text-sm text-gray-600">{donation.comments}</p>
        )}
      </div>

      <DonationDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        donation={donation}
        onDonationUpdate={onDelete}
        onSave={handleSave}
      />

      <PhotoUploadDialog
        open={showPhotoDialog}
        onClose={() => setShowPhotoDialog(false)}
        donationId={donation.id}
        onUploadComplete={handlePhotosUpdate}
      />
    </Card>
  );
};