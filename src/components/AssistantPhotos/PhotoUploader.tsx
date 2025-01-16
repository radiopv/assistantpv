import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";

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
      const files = Array.from(event.target.files);
      
      // Upload each file
      const uploadPromises = files.map(async (file) => {
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

        return publicUrl;
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      // Notify sponsors about the new photos
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
              title: `Nouvelles photos de ${child.name}`,
              content: `De nouvelles photos ont été ajoutées à l'album de ${child.name}.`,
              link: `/children/${childId}/album`
            });
        }
      }

      toast({
        title: "Photos ajoutées",
        description: "Les photos ont été ajoutées avec succès à l'album.",
      });

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error('Error uploading photos:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload des photos.",
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
        multiple
      />
      <Button disabled={uploading}>
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Upload en cours...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Ajouter des photos
          </>
        )}
      </Button>
    </div>
  );
};