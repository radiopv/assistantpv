import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDonationForm = (onDonationComplete?: () => void) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [city, setCity] = useState("");
  const [assistantName, setAssistantName] = useState("Vitia et Pancho");
  const [comments, setComments] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handlePhotoUpload = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('donation-photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('donation-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const resetForm = () => {
    setSelectedCategories([]);
    setQuantity("");
    setCity("");
    setAssistantName("Vitia et Pancho");
    setComments("");
    setDonorName("");
    setIsAnonymous(false);
    setPhotos(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0 || !quantity || !city) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins une catégorie et remplir tous les champs obligatoires.",
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Submitting form with assistant name:', assistantName);

      let photoUrls: string[] = [];
      if (photos && photos.length > 0) {
        photoUrls = await handlePhotoUpload(photos);
      }

      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .insert({
          assistant_name: assistantName,
          city: city,
          people_helped: parseInt(quantity),
          donation_date: new Date().toISOString(),
          comments: comments,
          photos: photoUrls,
          status: 'completed'
        })
        .select()
        .single();

      if (donationError) throw donationError;

      const donationItems = selectedCategories.map(categoryId => ({
        donation_id: donation.id,
        category_id: categoryId,
        quantity: parseInt(quantity),
      }));

      const { error: itemError } = await supabase
        .from('donation_items')
        .insert(donationItems);

      if (itemError) throw itemError;

      if (donorName || isAnonymous) {
        const { error: donorError } = await supabase
          .from('donors')
          .insert({
            donation_id: donation.id,
            name: donorName,
            is_anonymous: isAnonymous
          });

        if (donorError) throw donorError;
      }

      toast({
        title: "Don enregistré",
        description: "Le don a été enregistré avec succès.",
      });

      resetForm();
      onDonationComplete?.();

    } catch (error: any) {
      console.error('Error creating donation:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du don.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedCategories,
    quantity,
    city,
    assistantName,
    comments,
    donorName,
    isAnonymous,
    photos,
    loading,
    handleCategorySelect,
    setQuantity,
    setCity,
    setAssistantName,
    setComments,
    setDonorName,
    setIsAnonymous,
    setPhotos,
    handleSubmit
  };
};