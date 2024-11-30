import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";

interface HomeImage {
  id: string;
  url: string;
  position: string;
  is_mobile: boolean;
  layout_position: string;
}

const VALID_POSITIONS = ['main', 'secondary', 'tertiary'] as const;
type Position = typeof VALID_POSITIONS[number];

const HomeImages = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position>('main');

  const { data: images, isLoading, refetch } = useQuery({
    queryKey: ['home-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as HomeImage[];
    }
  });

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
          position: selectedPosition,
          layout_position: selectedPosition,
          is_mobile: false
        });

      if (dbError) throw dbError;

      toast({
        title: "Image ajoutée",
        description: "L'image a été ajoutée avec succès.",
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'upload.",
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
        description: "L'image a été supprimée avec succès.",
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des images de la page d'accueil</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ajouter une nouvelle image</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position de l'image</Label>
              <Select value={selectedPosition} onValueChange={(value) => setSelectedPosition(value as Position)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Principale</SelectItem>
                  <SelectItem value="secondary">Secondaire</SelectItem>
                  <SelectItem value="tertiary">Tertiaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
              />
            </div>
          </div>
        </Card>

        {/* Current Images */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Images actuelles</h2>
          <div className="space-y-4">
            {images?.map((image) => (
              <div key={image.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img src={image.url} alt="" className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">Position: {image.position}</p>
                  <p className="text-sm text-gray-500">Layout: {image.layout_position}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomeImages;