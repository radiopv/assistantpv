import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";

interface ProfilePhotoUploadProps {
  childId: string;
  currentPhotoUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export const ProfilePhotoUpload = ({ childId, currentPhotoUrl, onUploadComplete }: ProfilePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier:", error);
    }
  };

  const handleUpload = async (croppedImageBlob: Blob) => {
    try {
      setUploading(true);
      setCropDialogOpen(false);

      const fileExt = "jpg";
      const filePath = `${childId}/${Math.random()}.${fileExt}`;

      // Si une photo existe déjà, on la supprime
      if (currentPhotoUrl) {
        const oldPath = currentPhotoUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('children-photos')
            .remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('children-photos')
        .upload(filePath, croppedImageBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('children-photos')
        .getPublicUrl(filePath);

      // Fetch child details and sponsorships
      const { data: child } = await supabase
        .from('children')
        .select('name, sponsorships(sponsor_id)')
        .eq('id', childId)
        .single();

      console.log("Child data fetched:", child);

      if (child?.sponsorships) {
        console.log("Creating notifications for sponsors...");
        
        // Create notifications for each sponsor
        const notificationPromises = child.sponsorships.map(async (sponsorship: any) => {
          console.log("Creating notification for sponsor:", sponsorship.sponsor_id);
          
          return supabase
            .from('notifications')
            .insert({
              recipient_id: sponsorship.sponsor_id,
              type: 'photo_added',
              title: `Nouvelle photo de ${child.name}`,
              content: `Une nouvelle photo a été ajoutée à l'album de ${child.name}.`,
              link: `/children/${childId}/album`
            });
        });

        // Wait for all notifications to be created
        const notificationResults = await Promise.all(notificationPromises);
        console.log("Notification results:", notificationResults);
      }

      onUploadComplete(publicUrl);

      toast({
        title: "Photo mise à jour",
        description: "La photo de profil a été mise à jour avec succès.",
      });
    } catch (error: any) {
      console.error("Error during upload:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload de la photo.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="profile-photo">Photo de profil</Label>
      <Input
        id="profile-photo"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      <Button disabled={uploading}>
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Upload en cours..." : "Changer la photo"}
      </Button>

      <ImageCropDialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        imageSrc={selectedImage}
        onCropComplete={handleUpload}
      />
    </div>
  );
};