import { MultiFileUpload } from "@/components/shared/MultiFileUpload/MultiFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PhotoUploadProps {
  donationId?: string;
  sponsorId?: string;
  bucketName?: string;
  onUploadComplete?: () => void;
  onPhotosChange?: (files: FileList | null) => void;
}

export const PhotoUpload = ({ 
  donationId, 
  sponsorId,
  bucketName = 'donation-photos',
  onUploadComplete, 
  onPhotosChange 
}: PhotoUploadProps) => {
  const { toast } = useToast();

  const handleUploadComplete = async (urls: string[]) => {
    try {
      if (sponsorId) {
        const { error: updateError } = await supabase
          .from('sponsors')
          .update({ photo_url: urls[0] })
          .eq('id', sponsorId);

        if (updateError) throw updateError;
      } else if (donationId) {
        const photoEntries = urls.map(url => ({
          donation_id: donationId,
          url: url,
        }));

        const { error: dbError } = await supabase
          .from('donation_photos')
          .insert(photoEntries);

        if (dbError) throw dbError;
      }

      onUploadComplete?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout des photos.",
      });
    }
  };

  if (onPhotosChange) {
    return (
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => onPhotosChange(e.target.files)}
        className="w-full"
      />
    );
  }

  return (
    <MultiFileUpload
      bucketName={bucketName}
      path={sponsorId || donationId || 'uploads'}
      onUploadComplete={handleUploadComplete}
    />
  );
};