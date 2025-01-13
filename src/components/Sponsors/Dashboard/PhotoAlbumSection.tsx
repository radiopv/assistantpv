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
      albumOf: "Album de",
      noPhotos: "Aucune photo disponible pour le moment",
      loadingPhotos: "Chargement des photos..."
    },
    es: {
      addPhoto: "Agregar una foto",
      uploading: "Subiendo...",
      upload: "Subir",
      success: "Foto agregada con éxito",
      error: "Ocurrió un error durante la subida",
      albumOf: "Álbum de",
      noPhotos: "No hay fotos disponibles por el momento",
      loadingPhotos: "Cargando fotos..."
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: photos, isLoading, error, refetch } = useQuery({
    queryKey: ['album-photos', childId, sponsorId],
    queryFn: async () => {
      console.log("Fetching photos for child:", childId, "and sponsor:", sponsorId);
      
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
        toast.error("Erreur lors du chargement des photos");
        throw error;
      }

      console.log("Fetched photos:", data);
      return data || [];
    },
    retry: 1
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

      // Upload to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('album-media')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('album-media')
        .getPublicUrl(filePath);

      // Insert into database
      const { error: dbError } = await supabase
        .from('album_media')
        .insert({
          child_id: childId,
          sponsor_id: sponsorId,
          url: publicUrl,
          type: 'image',
          is_approved: true
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

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

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          Une erreur est survenue lors du chargement des photos
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">{t.loadingPhotos}</div>
      </Card>
    );
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

        {photos && photos.length > 0 ? (
          <PhotoGrid
            photos={photos}
            onPhotoDelete={(id) => setPhotoToDelete(id)}
            onToggleFeature={(id, featured) => handleToggleFavorite(id, featured)}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            {t.noPhotos}
          </div>
        )}

        <DeletePhotoDialog
          open={!!photoToDelete}
          onClose={() => setPhotoToDelete(null)}
          onConfirm={() => photoToDelete && handleDeletePhoto(photoToDelete)}
        />
      </div>
    </Card>
  );
};