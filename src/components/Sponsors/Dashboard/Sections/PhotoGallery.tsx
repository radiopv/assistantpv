import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoGalleryProps {
  photos: any[];
  childName: string;
}

export const PhotoGallery = ({ photos, childName }: PhotoGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations = {
    fr: {
      noPhotos: "Aucune photo disponible pour le moment.",
      photoHelp: "Cliquez sur l'étoile pour mettre en avant une photo sur la page d'accueil",
      deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette photo ?",
      deleteSuccess: "Photo supprimée avec succès",
      deleteError: "Erreur lors de la suppression",
      featureSuccess: "Photo mise en avant avec succès",
      featureError: "Erreur lors de la mise en avant",
      helpTitle: "Gestion des photos",
      helpDescription: "Les photos mises en avant apparaîtront sur la page d'accueil. Les besoins urgents seront automatiquement affichés en notification dès que l'assistant cubain les ajoutera."
    },
    es: {
      noPhotos: "No hay fotos disponibles por el momento.",
      photoHelp: "Haga clic en la estrella para destacar una foto en la página de inicio",
      deleteConfirm: "¿Está seguro de que desea eliminar esta foto?",
      deleteSuccess: "Foto eliminada con éxito",
      deleteError: "Error al eliminar la foto",
      featureSuccess: "Foto destacada con éxito",
      featureError: "Error al destacar la foto",
      helpTitle: "Gestión de fotos",
      helpDescription: "Las fotos destacadas aparecerán en la página de inicio. Las necesidades urgentes se mostrarán automáticamente en notificaciones tan pronto como el asistente cubano las agregue."
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;

    try {
      const { error } = await supabase
        .from('album_media')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(t.deleteSuccess);
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error(t.deleteError);
    }
  };

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('album_media')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(t.featureSuccess);
    } catch (error) {
      console.error('Error featuring photo:', error);
      toast.error(t.featureError);
    }
  };

  if (!photos?.length) {
    return <p className="text-gray-500">{t.noPhotos}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.url}
              alt={`Photo de ${childName}`}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                className={`${photo.is_featured ? 'bg-yellow-100' : 'bg-white/80'}`}
                onClick={() => handleToggleFeature(photo.id, photo.is_featured)}
              >
                <Star className={`h-4 w-4 ${photo.is_featured ? 'fill-yellow-400' : ''}`} />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(photo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.helpTitle}</DialogTitle>
            <DialogDescription>
              {t.helpDescription}
            </DialogDescription>
          </DialogHeader>
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt="Photo sélectionnée"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};