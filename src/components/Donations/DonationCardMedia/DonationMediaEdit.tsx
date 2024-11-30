import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DonationMediaEditProps {
  photo: any;
  onClose: () => void;
  onSave: () => void;
}

export const DonationMediaEdit = ({ photo, onClose, onSave }: DonationMediaEditProps) => {
  const { toast } = useToast();

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      const fileExt = "jpg";
      const filePath = `${photo.donation_id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('donation-photos')
        .upload(filePath, croppedImageBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('donation-photos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('donation_photos')
        .update({ url: publicUrl })
        .eq('id', photo.id);

      if (dbError) throw dbError;

      toast({
        title: "Photo mise à jour",
        description: "La photo a été mise à jour avec succès.",
      });

      onSave();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la photo.",
      });
    }
  };

  if (!photo) return null;

  return (
    <ImageCropDialog
      open={!!photo}
      onClose={onClose}
      imageSrc={photo.url}
      onCropComplete={handleCropComplete}
    />
  );
};