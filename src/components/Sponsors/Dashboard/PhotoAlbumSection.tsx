import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { AlbumMediaGrid } from '@/components/AlbumMedia/AlbumMediaGrid';
import { Button } from '@/components/ui/button';
import { ImagePlus } from 'lucide-react';

interface PhotoAlbumSectionProps {
  childId: string;
  sponsorId: string;
  childName: string;
}

const PhotoAlbumSection = ({ childId, sponsorId, childName }: PhotoAlbumSectionProps) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Starting photo upload for child:', childName);

    try {
      const uploadPromises = photos.map(async (photo) => {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${childId}/${fileName}`;

        // Upload photo to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('album-media')
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('album-media')
          .getPublicUrl(filePath);

        console.log('Photo uploaded successfully, creating database entry');

        // Create album media entry
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

        console.log('Database entry created, sending notification');

        // Create notification for sponsor
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: sponsorId,
            type: 'photo_upload',
            title: 'Nouvelle photo ajoutée',
            content: `Une nouvelle photo a été ajoutée à l'album de ${childName}`,
            link: `/children/${childId}/album`
          });

        if (notifError) {
          console.error('Error creating notification:', notifError);
          throw notifError;
        }

        console.log('Notification created successfully');

        return uploadData;
      });

      await Promise.all(uploadPromises);

      toast({
        title: "Succès",
        description: "Photos téléchargées avec succès",
      });

      setPhotos([]);
    } catch (error) {
      console.error('Erreur lors du téléchargement des photos:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement des photos",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Album photo de {childName}</h3>
          <Button 
            variant="outline" 
            onClick={() => document.getElementById(`photo-upload-${childId}`)?.click()}
            disabled={loading}
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            Ajouter des photos
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            id={`photo-upload-${childId}`}
            type="file" 
            multiple 
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {photos.length > 0 && (
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Téléchargement...' : 'Télécharger les photos'}
              </Button>
            </div>
          )}
        </form>

        <div className="mt-6">
          <AlbumMediaGrid childId={childId} />
        </div>
      </Card>
    </div>
  );
};

export default PhotoAlbumSection;