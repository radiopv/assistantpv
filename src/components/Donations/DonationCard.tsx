import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Video, Edit, Trash2 } from "lucide-react";
import { PhotoUpload } from "./PhotoUpload";
import { VideoUpload } from "./VideoUpload";
import { DonationHeader } from "./DonationHeader";
import { DonationDetails } from "./DonationDetails";
import { DonationMedia } from "./DonationMedia";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { DonationDialog } from "./DonationDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface DonationCardProps {
  donation: {
    id: string;
    assistant_name: string;
    city: string;
    people_helped: number;
    donation_date: string;
    status: string;
    comments: string | null;
  };
  onDelete?: () => void;
  isAdmin?: boolean;
}

export const DonationCard = ({ donation, onDelete, isAdmin = false }: DonationCardProps) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showCropDialog, setShowCropDialog] = useState(false);
  const { toast } = useToast();

  const { data: donationPhotos, refetch: refetchPhotos } = useQuery({
    queryKey: ['donation-photos', donation.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_photos')
        .select('*')
        .eq('donation_id', donation.id);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: donationVideos, refetch: refetchVideos } = useQuery({
    queryKey: ['donation-videos', donation.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_videos')
        .select('*')
        .eq('donation_id', donation.id);
      
      if (error) throw error;
      return data;
    }
  });

  const handleSaveEdit = async (editedDonation: any) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({
          city: editedDonation.city,
          people_helped: editedDonation.people_helped,
          assistant_name: editedDonation.assistant_name,
          comments: editedDonation.comments
        })
        .eq('id', donation.id);

      if (error) throw error;

      toast({
        title: "Don modifié",
        description: "Les modifications ont été enregistrées avec succès.",
      });

      setShowEditDialog(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du don.",
      });
    }
  };

  const handlePhotoSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDonation = async () => {
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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du don.",
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <DonationHeader donation={donation} />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Button>
            {isAdmin && (
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
                      Cette action est irréversible. Le don et toutes les données associées seront définitivement supprimés.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDonation}>
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <DonationDetails donation={donation} />
        
        {donation.comments && (
          <div>
            <p className="text-gray-500">Commentaires</p>
            <p className="text-sm">{donation.comments}</p>
          </div>
        )}

        <DonationMedia 
          photos={donationPhotos} 
          videos={donationVideos}
          onPhotoDelete={async (photoId) => {
            await supabase.from('donation_photos').delete().eq('id', photoId);
            refetchPhotos();
          }}
          onVideoDelete={async (videoId) => {
            await supabase.from('donation_videos').delete().eq('id', videoId);
            refetchVideos();
          }}
        />

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPhotoUpload(!showPhotoUpload)}
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            {showPhotoUpload ? "Fermer" : "Ajouter des photos"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVideoUpload(!showVideoUpload)}
            className="flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            {showVideoUpload ? "Fermer" : "Ajouter des vidéos"}
          </Button>
        </div>

        {showPhotoUpload && (
          <div className="space-y-4">
            <PhotoUpload
              donationId={donation.id}
              onPhotosChange={handlePhotoSelect}
            />
          </div>
        )}

        {showVideoUpload && (
          <VideoUpload
            donationId={donation.id}
            onUploadComplete={() => {
              refetchVideos();
              setShowVideoUpload(false);
            }}
          />
        )}

        <DonationDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          donation={donation}
          onSave={handleSaveEdit}
        />

        <ImageCropDialog
          open={showCropDialog}
          onClose={() => setShowCropDialog(false)}
          imageSrc={selectedImage}
          onCropComplete={async (croppedImageBlob) => {
            try {
              const fileExt = "jpg";
              const filePath = `${donation.id}/${Math.random()}.${fileExt}`;

              const { error: uploadError } = await supabase.storage
                .from('donation-photos')
                .upload(filePath, croppedImageBlob);

              if (uploadError) throw uploadError;

              const { data: { publicUrl } } = supabase.storage
                .from('donation-photos')
                .getPublicUrl(filePath);

              const { error: dbError } = await supabase
                .from('donation_photos')
                .insert({
                  donation_id: donation.id,
                  url: publicUrl,
                });

              if (dbError) throw dbError;

              toast({
                title: "Photo ajoutée",
                description: "La photo a été ajoutée avec succès.",
              });

              refetchPhotos();
              setShowCropDialog(false);
              setShowPhotoUpload(false);
            } catch (error) {
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de l'upload de la photo.",
              });
            }
          }}
        />
      </div>
    </Card>
  );
};