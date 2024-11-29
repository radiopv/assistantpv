import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ImageUploadSection = () => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadPosition, setUploadPosition] = useState<"left" | "right" | "mobile">("left");

  const uploadImage = useMutation({
    mutationFn: async ({ file, position }: { file: File, position: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('home-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('home-images')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('home_images')
        .insert({
          url: publicUrl,
          position: 'hero',
          layout_position: position,
          is_mobile: position === 'mobile'
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-images'] });
      toast.success("Image téléchargée avec succès");
      setSelectedImage(null);
    },
    onError: (error) => {
      toast.error("Erreur lors du téléchargement: " + error.message);
    }
  });

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;
    
    await uploadImage.mutateAsync({
      file: selectedImage,
      position: uploadPosition
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des images</h2>
      <form onSubmit={handleImageUpload} className="space-y-4">
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <select
            className="w-full p-2 border rounded"
            value={uploadPosition}
            onChange={(e) => setUploadPosition(e.target.value as "left" | "right" | "mobile")}
          >
            <option value="left">Image Gauche (Desktop)</option>
            <option value="right">Image Droite (Desktop)</option>
            <option value="mobile">Image Mobile</option>
          </select>
        </div>
        <Button 
          type="submit" 
          disabled={!selectedImage || uploadImage.isPending}
        >
          {uploadImage.isPending ? (
            <Loader2 className="animate-spin mr-2" />
          ) : null}
          Télécharger l'image
        </Button>
      </form>
    </Card>
  );
};