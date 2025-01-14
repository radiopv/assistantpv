import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface PhotoUploaderProps {
  childId: string;
  onUploadSuccess?: () => void;
}

export const PhotoUploader = ({ childId, onUploadSuccess }: PhotoUploaderProps) => {
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

      const { error: uploadError } = await supabase.storage
        .from('album-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('album-media')
        .getPublicUrl(filePath);

      // Insert into album_media table
      const { error: dbError } = await supabase
        .from('album_media')
        .insert({
          child_id: childId,
          url: publicUrl,
          type: 'image'
        });

      if (dbError) throw dbError;

      // Notify sponsors about the new photo
      const { data: child } = await supabase
        .from('children')
        .select('name, sponsorships(sponsor_id)')
        .eq('id', childId)
        .single();

      if (child?.sponsorships) {
        for (const sponsorship of child.sponsorships) {
          await supabase
            .from('notifications')
            .insert({
              recipient_id: sponsorship.sponsor_id,
              type: 'photo_added',
              title: `Nouvelle photo de ${child.name}`,
              content: `Une nouvelle photo a été ajoutée à l'album de ${child.name}.`,
              link: `/children/${childId}/album`
            });
        }
      }

      toast({
        title: "Photo ajoutée",
        description: "La photo a été ajoutée avec succès à l'album.",
      });

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload de la photo.",
      });
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      <Button disabled={uploading}>
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Upload en cours..." : "Ajouter une photo"}
      </Button>
    </div>
  );
};