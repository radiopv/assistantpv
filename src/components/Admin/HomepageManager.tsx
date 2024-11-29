import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface HomepageConfig {
  id: string;
  section_name: string;
  title: string;
  subtitle: string;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  is_visible: boolean;
  display_order: number;
}

export const HomepageManager = () => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadPosition, setUploadPosition] = useState<"left" | "right" | "mobile">("left");

  const { data: config, isLoading } = useQuery({
    queryKey: ['homepage-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_config')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as HomepageConfig[];
    }
  });

  const updateConfig = useMutation({
    mutationFn: async (updatedConfig: Partial<HomepageConfig>) => {
      const { error } = await supabase
        .from('homepage_config')
        .update(updatedConfig)
        .eq('id', updatedConfig.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-config'] });
      toast.success("Configuration mise à jour avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    }
  });

  const uploadImage = useMutation({
    mutationFn: async ({ file, position }: { file: File, position: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to storage
      const { error: uploadError, data } = await supabase.storage
        .from('home-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('home-images')
        .getPublicUrl(filePath);

      // Insert into home_images table
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

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;
    
    await uploadImage.mutateAsync({
      file: selectedImage,
      position: uploadPosition
    });
  };

  return (
    <div className="space-y-8">
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

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Configuration des sections</h2>
        <div className="space-y-6">
          {config?.map((section) => (
            <div key={section.id} className="space-y-4 border-b pb-4">
              <h3 className="text-xl font-semibold capitalize">{section.section_name}</h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <Input
                    value={section.title}
                    onChange={(e) => updateConfig.mutate({
                      ...section,
                      title: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sous-titre</label>
                  <Input
                    value={section.subtitle}
                    onChange={(e) => updateConfig.mutate({
                      ...section,
                      subtitle: e.target.value
                    })}
                  />
                </div>
                {section.description !== null && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={section.description || ''}
                      onChange={(e) => updateConfig.mutate({
                        ...section,
                        description: e.target.value
                      })}
                    />
                  </div>
                )}
                {section.button_text !== null && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Texte du bouton</label>
                      <Input
                        value={section.button_text || ''}
                        onChange={(e) => updateConfig.mutate({
                          ...section,
                          button_text: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Lien du bouton</label>
                      <Input
                        value={section.button_link || ''}
                        onChange={(e) => updateConfig.mutate({
                          ...section,
                          button_link: e.target.value
                        })}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};