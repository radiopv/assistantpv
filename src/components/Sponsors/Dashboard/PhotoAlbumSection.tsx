import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

    try {
      const uploadPromises = photos.map(async (photo) => {
        const { data, error } = await supabase.storage
          .from('photos')
          .upload(`${childId}/${photo.name}`, photo);

        if (error) {
          throw error;
        }

        return data;
      });

      await Promise.all(uploadPromises);
      toast({
        title: 'Success',
        description: 'Photos uploaded successfully!',
      });
      setPhotos([]);
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error uploading your photos.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Photos'}
      </button>
    </form>
  );
};

export default PhotoAlbumSection;