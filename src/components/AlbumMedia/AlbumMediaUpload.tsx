import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface AlbumMediaUploadProps {
  childId: string;
  onUploadComplete?: () => void;
}

export const AlbumMediaUpload = ({ childId, onUploadComplete }: AlbumMediaUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${childId}/${Math.random()}.${fileExt}`;

      console.log("Starting file upload...");
      const { error: uploadError } = await supabase.storage
        .from('album-media')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully, creating album media entry...");

      const { data: { publicUrl } } = supabase.storage
        .from('album-media')
        .getPublicUrl(filePath);

      console.log("Creating album media entry with URL:", publicUrl);
      const { error: dbError } = await supabase
        .from('album_media')
        .insert({
          child_id: childId,
          url: publicUrl,
          type: 'image',
          is_approved: true
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      console.log("Album media entry created successfully");
      
      // Vérifier les notifications après l'ajout
      const { data: notifications, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (notifError) {
        console.error("Error checking notifications:", notifError);
      } else {
        console.log("Latest notification:", notifications?.[0]);
      }

      toast.success("Photo ajoutée avec succès");
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Error in handleFileSelect:", error);
      toast.error("Erreur lors de l'ajout de la photo");
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        id="photo"
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      <label htmlFor="photo">
        <Button 
          variant="outline" 
          disabled={uploading}
          className="w-full"
          asChild
        >
          <span>
            <ImagePlus className="w-4 h-4 mr-2" />
            {uploading ? "Ajout en cours..." : "Ajouter une photo"}
          </span>
        </Button>
      </label>
    </div>
  );
};