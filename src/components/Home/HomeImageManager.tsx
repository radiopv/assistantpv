import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const HomeImageManager = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [images, setImages] = useState<any[]>([]);

  const loadImages = async () => {
    const { data, error } = await supabase
      .from('home_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les images",
      });
      return;
    }

    setImages(data || []);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('home-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('home-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('home_images')
        .insert({
          url: publicUrl,
          position: 'main',
          is_mobile: false
        });

      if (dbError) throw dbError;

      toast({
        title: "Image ajoutée",
        description: "L'image a été ajoutée avec succès",
      });

      loadImages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('home_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès",
      });

      loadImages();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="image">Ajouter une image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
        <Button disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Upload en cours..." : "Upload"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt="Home"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDelete(image.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};