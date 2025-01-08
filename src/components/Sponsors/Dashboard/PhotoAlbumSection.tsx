import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PhotoAlbumSectionProps {
  childId: string;
  sponsorId: string;
}

export const PhotoAlbumSection = ({ childId, sponsorId }: PhotoAlbumSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery({
    queryKey: ['album-photos', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('child_id', childId)
        .eq('type', 'image')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const filePath = `${childId}/${Math.random()}.${fileExt}`;

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
          child_id: childId,
          sponsor_id: sponsorId,
          url: publicUrl,
          type: 'image'
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['album-photos', childId] });
      toast.success("Photo ajoutée avec succès");
      setSelectedFile(null);
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de la photo");
    }
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from('album_media')
        .update({ is_featured: featured })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['album-photos', childId] });
      toast.success("Photo mise à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la photo");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('album_media')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['album-photos', childId] });
      toast.success("Photo supprimée avec succès");
      setPhotoToDelete(null);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la photo");
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Album Photos</h3>
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
              Ajouter des photos
            </Button>
          </div>
        </div>

        {selectedFile && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <Button onClick={handleUpload} className="mt-2">
                Uploader
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos?.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt=""
                className="w-full aspect-square object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setPhotoToDelete(photo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant={photo.is_featured ? "default" : "secondary"}
                  size="icon"
                  onClick={() => toggleFeatureMutation.mutate({
                    id: photo.id,
                    featured: !photo.is_featured
                  })}
                >
                  <Star className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <AlertDialog open={!!photoToDelete} onOpenChange={() => setPhotoToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => photoToDelete && deleteMutation.mutate(photoToDelete)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};