import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface ProfilePhotoUploadProps {
  childId: string;
  currentPhotoUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export const ProfilePhotoUpload = ({ childId, currentPhotoUrl, onUploadComplete }: ProfilePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
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
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('children-photos')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);

      toast({
        title: "Photo mise à jour",
        description: "La photo de profil a été mise à jour avec succès.",
      });
    } catch (error: any) {
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
        onChange={handleUpload}
        disabled={uploading}
      />
      <Button disabled={uploading}>
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Upload en cours..." : "Changer la photo"}
      </Button>
    </div>
  );
};