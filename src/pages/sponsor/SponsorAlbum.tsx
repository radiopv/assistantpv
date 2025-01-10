import { useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { PhotoGrid } from "@/components/Sponsors/Dashboard/PhotoAlbum/PhotoGrid";
import { UploadSection } from "@/components/Sponsors/Dashboard/PhotoAlbum/UploadSection";
import { PhotoViewerDialog } from "@/components/Sponsors/Dashboard/PhotoAlbum/PhotoViewerDialog";

const SponsorAlbum = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhoto: "Ajouter une photo",
      uploading: "Upload en cours...",
      upload: "Upload",
      success: "Photo ajoutée avec succès",
      error: "Une erreur est survenue lors de l'upload",
      selectChild: "Sélectionner un enfant",
      deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette photo ?",
      deleteSuccess: "Photo supprimée avec succès",
      deleteError: "Erreur lors de la suppression",
      toggleFavoriteSuccess: "Statut favori mis à jour",
      toggleFavoriteError: "Erreur lors de la mise à jour du statut favori"
    },
    es: {
      addPhoto: "Agregar una foto",
      uploading: "Subiendo...",
      upload: "Subir",
      success: "Foto agregada con éxito",
      error: "Ocurrió un error durante la subida",
      selectChild: "Seleccionar un niño",
      deleteConfirm: "¿Está seguro de que desea eliminar esta foto?",
      deleteSuccess: "Foto eliminada con éxito",
      deleteError: "Error al eliminar la foto",
      toggleFavoriteSuccess: "Estado favorito actualizado",
      toggleFavoriteError: "Error al actualizar el estado favorito"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: sponsoredChildren } = useQuery({
    queryKey: ["sponsored-children", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorships")
        .select(`
          child_id,
          children (
            id,
            name
          )
        `)
        .eq("sponsor_id", user?.id)
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
  });

  const { data: photos, isLoading, refetch } = useQuery({
    queryKey: ["sponsor-photos", user?.id],
    queryFn: async () => {
      const { data: sponsorships } = await supabase
        .from("sponsorships")
        .select("child_id")
        .eq("sponsor_id", user?.id)
        .eq("status", "active");

      if (!sponsorships?.length) {
        return [];
      }

      const childIds = sponsorships.map(s => s.child_id);

      const { data: albumPhotos, error: photosError } = await supabase
        .from("album_media")
        .select(`
          id,
          url,
          title,
          description,
          created_at,
          child_id,
          is_featured,
          children (
            name
          ),
          sponsors!album_media_new_sponsor_id_fkey (
            name,
            role,
            is_anonymous
          )
        `)
        .in("child_id", childIds)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (photosError) {
        console.error("Error fetching photos:", photosError);
        throw photosError;
      }

      return albumPhotos || [];
    },
    enabled: !!user?.id
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!selectedChildId) {
        toast({
          variant: "destructive",
          title: t.error,
          description: t.selectChild
        });
        return;
      }

      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${selectedChildId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('album-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('album-media')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('album_media')
        .insert({
          child_id: selectedChildId,
          sponsor_id: user?.id,
          url: publicUrl,
          type: 'image',
          is_approved: true
        });

      if (dbError) throw dbError;

      toast({
        title: t.success,
        description: t.success
      });
      refetch();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: t.error,
        description: t.error
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm(t.deleteConfirm)) return;

    try {
      const { error } = await supabase
        .from('album_media')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: t.deleteSuccess,
        description: t.deleteSuccess
      });
      refetch();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        variant: "destructive",
        title: t.deleteError,
        description: t.deleteError
      });
    }
  };

  const handleToggleFavorite = async (photoId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('album_media')
        .update({ is_featured: !currentStatus })
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: t.toggleFavoriteSuccess,
        description: t.toggleFavoriteSuccess
      });
      refetch();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        variant: "destructive",
        title: t.toggleFavoriteError,
        description: t.toggleFavoriteError
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Album Photo</h1>
        <UploadSection
          children={sponsoredChildren || []}
          selectedChildId={selectedChildId}
          onChildSelect={setSelectedChildId}
          onFileSelect={handleFileSelect}
          uploading={uploading}
          translations={t}
        />
      </div>

      <PhotoGrid
        photos={photos || []}
        onPhotoClick={(url) => setSelectedImage(url)}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeletePhoto}
      />

      <PhotoViewerDialog
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default SponsorAlbum;