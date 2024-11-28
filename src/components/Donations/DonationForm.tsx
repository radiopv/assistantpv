import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, Shirt, Utensils, BookOpen, HeartPulse, Package, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  { id: 1, name: 'Monétaire', icon: DollarSign },
  { id: 2, name: 'Vêtements', icon: Shirt },
  { id: 3, name: 'Nourriture', icon: Utensils },
  { id: 4, name: 'Éducation', icon: BookOpen },
  { id: 5, name: 'Médical', icon: HeartPulse },
  { id: 6, name: 'Autre', icon: Package },
];

interface DonationFormProps {
  onDonationComplete?: () => void;
}

export const DonationForm = ({ onDonationComplete }: DonationFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");
  const [city, setCity] = useState("");
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

      // 1. Upload photos if any
      let photoUrls: string[] = [];
      if (photos && photos.length > 0) {
        photoUrls = await handlePhotoUpload(photos);
      }

      // 2. Create the main donation
      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .insert({
          assistant_name: "Assistant",
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

      // 3. Create donation items - Fix: Convert selectedCategory to string
      const { error: itemError } = await supabase
        .from('donation_items')
        .insert({
          donation_id: donation.id,
          category_id: selectedCategory.toString(),
          quantity: parseInt(quantity),
        });

      if (itemError) throw itemError;

      // 4. Create donor if name provided
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

      // 5. Create photo records if any
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

      // Reset form
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
          <div className="grid grid-cols-3 gap-4 mt-2">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  type="button"
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ville où le don a été fait"
            />
          </div>

          <div>
            <Label htmlFor="quantity">Nombre de personnes aidées</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
            />
          </div>
        </div>

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

        <div className="space-y-4">
          <Label>Information du donateur</Label>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Nom du donateur (optionnel)"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              disabled={isAnonymous}
            />
            <Button
              type="button"
              variant={isAnonymous ? "default" : "outline"}
              onClick={() => setIsAnonymous(!isAnonymous)}
            >
              Anonyme
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="photos">Photos</Label>
          <div className="mt-2">
            <Input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotos(e.target.files)}
              className="cursor-pointer"
            />
          </div>
        </div>

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