import { useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface AlbumMediaUploadProps {
  childId: string;
  onUploadComplete?: () => void;
}

const SponsorAlbum = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhoto: "Ajouter une photo",
      uploading: "Upload en cours...",
      upload: "Upload",
      success: "Photo ajoutée avec succès",
      error: "Une erreur est survenue lors de l'upload",
    },
    es: {
      addPhoto: "Agregar una foto",
      uploading: "Subiendo...",
      upload: "Subir",
      success: "Foto agregada con éxito",
      error: "Ocurrió un error durante la subida",
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: photos, isLoading, refetch } = useQuery({
    queryKey: ["sponsor-photos", user?.id],
    queryFn: async () => {
      // First get all active sponsorships for the sponsor
      const { data: sponsorships } = await supabase
        .from("sponsorships")
        .select("child_id")
        .eq("sponsor_id", user?.id)
        .eq("status", "active");

      if (!sponsorships?.length) {
        return [];
      }

      const childIds = sponsorships.map(s => s.child_id);

      // Then get all photos for these children
      const { data: albumPhotos, error: photosError } = await supabase
        .from("album_media")
        .select(`
          id,
          url,
          title,
          description,
          created_at,
          child_id,
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
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      // Get the child ID from the first active sponsorship
      const { data: sponsorship } = await supabase
        .from("sponsorships")
        .select("child_id")
        .eq("sponsor_id", user?.id)
        .eq("status", "active")
        .limit(1)
        .single();

      if (!sponsorship) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Aucun parrainage actif trouvé"
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${sponsorship.child_id}/${fileName}`;

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
          child_id: sponsorship.child_id,
          sponsor_id: user?.id,
          url: publicUrl,
          type: 'image',
          is_approved: true
        });

      if (dbError) throw dbError;

      toast({
        title: "Succès",
        description: "Photo ajoutée avec succès"
      });

      refetch();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload"
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Album Photo</h1>
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
            Ajouter une photo
          </Button>
        </div>
      </div>

      {!photos?.length ? (
        <p>Aucune photo disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card 
              key={photo.id} 
              className="overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(photo.url)}
            >
              <img 
                src={photo.url} 
                alt={photo.title || "Photo"} 
                className="w-full h-48 object-cover"
              />
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