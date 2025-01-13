import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { PhotoUploadPreview } from "./PhotoAlbum/PhotoUploadPreview";
import { PhotoGrid } from "./PhotoAlbum/PhotoGrid";
import { DeletePhotoDialog } from "./PhotoAlbum/DeletePhotoDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoAlbumSectionProps {
  childId: string;
  sponsorId: string;
  childName: string;
}

export const PhotoAlbumSection = ({ childId, sponsorId, childName }: PhotoAlbumSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhoto: "Ajouter une photo",
      uploading: "Upload en cours...",
      upload: "Upload",
      success: "Photo ajoutée avec succès",
      error: "Une erreur est survenue lors de l'upload",
      albumOf: "Album de"
    },
    es: {
      addPhoto: "Agregar una foto",
      uploading: "Subiendo...",
      upload: "Subir",
      success: "Foto agregada con éxito",
      error: "Ocurrió un error durante la subida",
      albumOf: "Álbum de"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: photos, isLoading, refetch } = useQuery({
    queryKey: ['album-photos', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select(`
          id,
          url,
          title,
          description,
          created_at,
          is_featured,
          children (
            name
          ),
          sponsors (
            name,
            role,
            is_anonymous
          )
        `)
        .eq('child_id', childId)
        .eq('sponsor_id', sponsorId)
        .eq('type', 'image')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
        throw error;
      }

      return data || [];
    }
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${childId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('album-media')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('album-media')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('album_media')
        .insert({
          child_id: childId,
          sponsor_id: sponsorId,
          url: publicUrl,
          type: 'image',
          is_approved: true
        });

      if (dbError) throw dbError;

      toast.success(t.success);
      setSelectedFile(null);
      refetch();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error(t.error);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('album_media')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      toast.success("Photo supprimée avec succès");
      setPhotoToDelete(null);
      refetch();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleToggleFavorite = async (photoId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('album_media')
        .update({ is_featured: !currentStatus })
        .eq('id', photoId);

      if (error) throw error;

      toast.success("Statut favori mis à jour");
      refetch();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("Erreur lors de la mise à jour du statut favori");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t.albumOf} {childName}</h3>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
            />
            <Button
              onClick={() => document.getElementById('photo-upload')?.click()}
              variant="outline"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              {t.addPhoto}
            </Button>
          </div>
        </div>

        <PhotoUploadPreview
          selectedFile={selectedFile}
          handleUpload={handleUpload}
        />

        <PhotoGrid
          photos={photos || []}
          onPhotoDelete={(id) => setPhotoToDelete(id)}
          onToggleFeature={(id, featured) => handleToggleFavorite(id, featured)}
        />

        <DeletePhotoDialog
          open={!!photoToDelete}
          onClose={() => setPhotoToDelete(null)}
          onConfirm={() => photoToDelete && handleDeletePhoto(photoToDelete)}
        />
      </div>
    </Card>
  );
};