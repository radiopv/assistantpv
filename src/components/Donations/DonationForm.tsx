import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DonationCategorySelect } from "./DonationCategorySelect";
import { DonationBasicInfo } from "./DonationBasicInfo";
import { DonorInfo } from "./DonorInfo";
import { PhotoUpload } from "./PhotoUpload";
import { DonationSubmitButton } from "./DonationSubmitButton";

interface DonationFormProps {
  onDonationComplete?: () => void;
}

export const DonationForm = ({ onDonationComplete }: DonationFormProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [city, setCity] = useState("");
  const [assistantName, setAssistantName] = useState("Assistant");
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

      setSelectedCategories([]);
      setQuantity("");
      setCity("");
      setComments("");
      setDonorName("");
      setIsAnonymous(false);
      setPhotos(null);
      onDonationComplete?.();

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du don.",
      });
      console.error('Error creating donation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Catégories</Label>
          <DonationCategorySelect
            selectedCategories={selectedCategories}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        <DonationBasicInfo
          city={city}
          onCityChange={setCity}
          quantity={quantity}
          onQuantityChange={setQuantity}
          assistantName={assistantName}
          onAssistantNameChange={setAssistantName}
        />

        <div>
          <Label htmlFor="comments">Commentaires</Label>
          <Textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Détails supplémentaires sur le don"
            className="h-24"
          />
        </div>

        <DonorInfo
          donorName={donorName}
          onDonorNameChange={setDonorName}
          isAnonymous={isAnonymous}
          onAnonymousChange={setIsAnonymous}
        />

        <PhotoUpload onPhotosChange={setPhotos} />

        <DonationSubmitButton 
          loading={loading}
          disabled={selectedCategories.length === 0 || !quantity || !city}
        />
      </form>
    </Card>
  );
};