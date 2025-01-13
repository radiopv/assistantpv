import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { AlbumMediaGrid } from '@/components/AlbumMedia/AlbumMediaGrid';

interface PhotoAlbumSectionProps {
  childId: string;
  sponsorId: string;
  childName: string;
}

const PhotoAlbumSection = ({ childId, sponsorId, childName }: PhotoAlbumSectionProps) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: albumPhotos, isLoading, refetch } = useQuery({
    queryKey: ['album-photos', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select(`
          id,
          url,
          type,
          title,
          description,
          is_featured,
          created_at,
          child_id,
          sponsor_id
        `)
        .eq('child_id', childId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
        throw error;
      }

      return data || [];
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadPromises = photos.map(async (photo) => {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${childId}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('album-media')
          .upload(filePath, photo);

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

        return uploadData;
      });

      await Promise.all(uploadPromises);

      toast({
        title: "Succès",
        description: "Photos téléchargées avec succès",
      });

      setPhotos([]);
      refetch();
    } catch (error) {
      console.error('Error uploading photos:', error);
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
      <h3 className="text-lg font-medium">Album photo de {childName}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="file" 
          multiple 
          onChange={handleFileChange}
          accept="image/*"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
        <button 
          type="submit" 
          disabled={loading || photos.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Téléchargement...' : 'Télécharger les photos'}
        </button>
      </form>

      <AlbumMediaGrid childId={childId} />
    </div>
  );
};

export default PhotoAlbumSection;