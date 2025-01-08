import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageCropDialog } from "@/components/ImageCrop/ImageCropDialog";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HomeContentManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: heroImage, isError } = useQuery({
    queryKey: ['home-hero-image'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_images')
        .select('*')
        .eq('position', 'hero')
        .maybeSingle();  // Changed from .single() to .maybeSingle()

      if (error) throw error;
      return data;
    }
  });

  const { data: sections } = useQuery({
    queryKey: ['homepage-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*');

      if (error) throw error;
      return data;
    }
  });

  const updateSection = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      const { error } = await supabase
        .from('homepage_sections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-sections'] });
      toast({
        title: "Section mise à jour",
        description: "Le contenu a été mis à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
      });
      console.error('Error updating section:', error);
    }
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setCropDialogOpen(true);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setCropDialogOpen(false);
    setUploadingImage(true);

    try {
      // Upload to Supabase Storage
      const filename = `hero-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('home-images')
        .upload(filename, croppedImageBlob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('home-images')
        .getPublicUrl(filename);

      // Update or insert in home_images table
      const { error: dbError } = await supabase
        .from('home_images')
        .upsert({
          url: publicUrl,
          position: 'hero',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'position'
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['home-hero-image'] });
      toast({
        title: "Image mise à jour",
        description: "L'image a été mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'image",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Gestion du contenu de la page d'accueil</h1>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList>
          <TabsTrigger value="hero">Image Principale</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Image Hero</h2>
            
            {heroImage?.url && (
              <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                <img
                  src={heroImage.url}
                  alt="Hero actuelle"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="mb-4"
              />
              <p className="text-sm text-gray-500">
                Format recommandé : 1920x1080px, JPG ou PNG
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {sections?.map((section) => (
            <Card key={section.id} className="p-6">
              <h3 className="text-lg font-semibold mb-4">{section.section_key}</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Titre"
                  value={section.title || ''}
                  onChange={(e) => updateSection.mutate({
                    id: section.id,
                    updates: { title: e.target.value }
                  })}
                />
                <Input
                  placeholder="Sous-titre"
                  value={section.subtitle || ''}
                  onChange={(e) => updateSection.mutate({
                    id: section.id,
                    updates: { subtitle: e.target.value }
                  })}
                />
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {selectedImage && (
        <ImageCropDialog
          open={cropDialogOpen}
          onClose={() => setCropDialogOpen(false)}
          imageSrc={URL.createObjectURL(selectedImage)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default HomeContentManagement;