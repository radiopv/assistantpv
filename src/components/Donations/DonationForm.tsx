import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DonationCategorySelect } from "./DonationCategorySelect";
import { DonationBasicInfo } from "./DonationBasicInfo";
import { DonorInfo } from "./DonorInfo";
import { PhotoUpload } from "./PhotoUpload";

interface DonationFormProps {
  onDonationComplete?: () => void;
}

export const DonationForm = ({ onDonationComplete }: DonationFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [city, setCity] = useState("");
  const [assistantName, setAssistantName] = useState("Assistant");
  const [comments, setComments] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    if (!selectedCategory || !quantity || !city) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
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

      const { error: itemError } = await supabase
        .from('donation_items')
        .insert({
          donation_id: donation.id,
          category_id: selectedCategory,
          quantity: parseInt(quantity),
        });

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

      if (photoUrls.length > 0) {
        const photoRecords = photoUrls.map(url => ({
          donation_id: donation.id,
          url: url,
        }));

        const { error: photoError } = await supabase
          .from('donation_photos')
          .insert(photoRecords);

        if (photoError) throw photoError;
      }

      toast({
        title: "Don enregistré",
        description: "Le don a été enregistré avec succès.",
      });

      setSelectedCategory(null);
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
          <Label>Catégorie</Label>
          <DonationCategorySelect
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
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

        <Button 
          type="submit" 
          disabled={!selectedCategory || !quantity || !city || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer le don"
          )}
        </Button>
      </form>
    </Card>
  );
};