import { useState, useRef } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AlbumMediaUploadProps {
  childId: string;
  onUploadComplete?: () => void;
}

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

  // Fetch sponsored children
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
        <div className="flex gap-4 items-center">
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t.selectChild} />
            </SelectTrigger>
            <SelectContent>
              {sponsoredChildren?.map((sponsorship) => (
                <SelectItem key={sponsorship.children.id} value={sponsorship.children.id}>
                  {sponsorship.children.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <input
              type="file"
              id="photo-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <Button
              onClick={() => document.getElementById('photo-upload')?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ImagePlus className="w-4 h-4 mr-2" />
              )}
              {t.addPhoto}
            </Button>
          </div>
        </div>
      </div>

      {!photos?.length ? (
        <p>Aucune photo disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card 
              key={photo.id} 
              className="overflow-hidden cursor-pointer relative group"
            >
              <img 
                src={photo.url} 
                alt={photo.title || "Photo"} 
                className="w-full h-48 object-cover"
                onClick={() => setSelectedImage(photo.url)}
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(photo.id, photo.is_featured);
                  }}
                >
                  <Star className={`w-4 h-4 ${photo.is_featured ? "fill-yellow-400" : ""}`} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePhoto(photo.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4">
                <h3 className="font-medium">{photo.title || `Photo de ${photo.children?.name}`}</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    Ajoutée par: {photo.sponsors?.role === 'assistant' ? 'Assistant' : 'Parrain'}
                  </p>
                  <p>
                    {format(new Date(photo.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
                {photo.description && (
                  <p className="mt-2 text-sm text-gray-600">{photo.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Photo en plein écran" 
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorAlbum;