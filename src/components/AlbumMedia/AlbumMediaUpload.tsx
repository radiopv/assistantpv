import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { PhotoUploadDialog } from "@/components/Sponsors/Dashboard/PhotoAlbum/PhotoUploadDialog";

interface AlbumMediaUploadProps {
  childId: string;
  onUploadComplete?: () => void;
}

export const AlbumMediaUpload = ({ childId, onUploadComplete }: AlbumMediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUpload = async (data: {
    file: File;
    caption: string;
    description: string;
    category: string;
  }) => {
    try {
      setUploading(true);

      const fileExt = data.file.name.split('.').pop();
      const filePath = `${childId}/${Math.random()}.${fileExt}`;

      console.log("Starting file upload...");
      const { error: uploadError } = await supabase.storage
        .from('album-media')
        .upload(filePath, data.file);

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
          is_approved: true,
          caption: data.caption,
          description: data.description,
          category: data.category
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      console.log("Album media entry created successfully");
      
      toast.success("Photo ajoutée avec succès");
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Error in handleUpload:", error);
      toast.error("Erreur lors de l'ajout de la photo");
    } finally {
      setUploading(false);
      setDialogOpen(false);
    }
  };

  return (
    <div className="mt-4">
      <Button 
        variant="outline" 
        onClick={() => setDialogOpen(true)}
        disabled={uploading}
        className="w-full"
      >
        <ImagePlus className="w-4 h-4 mr-2" />
        {uploading ? "Ajout en cours..." : "Ajouter une photo"}
      </Button>

      <PhotoUploadDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};