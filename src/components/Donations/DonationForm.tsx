import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DonationCategorySelect } from "./DonationCategorySelect";
import { DonationBasicInfo } from "./DonationBasicInfo";
import { DonorInfoInput } from "./DonorInfoInput";
import { DonationSubmitButton } from "./DonationSubmitButton";
import { DonationMediaUpload } from "./Media/DonationMediaUpload";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DonationFormProps {
  onDonationComplete?: () => void;
}

export const DonationForm = ({ onDonationComplete }: DonationFormProps) => {
  const { language } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [city, setCity] = useState("");
  const [assistantName, setAssistantName] = useState("Assistant");
  const [comments, setComments] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [donationId, setDonationId] = useState<string | null>(null);
  const { toast } = useToast();

  const translations = {
    fr: {
      addMedia: "Ajouter des photos/vidéos",
      error: "Erreur",
      errorMessage: "Veuillez sélectionner au moins une catégorie et remplir tous les champs obligatoires.",
      donationRegistered: "Don enregistré",
      successMessage: "Le don a été enregistré avec succès.",
      errorSaving: "Une erreur est survenue lors de l'enregistrement du don.",
      categories: "Catégories",
      comments: "Commentaires",
      commentsPlaceholder: "Ajoutez vos commentaires ici..."
    },
    es: {
      addMedia: "Agregar fotos/videos",
      error: "Error",
      errorMessage: "Por favor, seleccione al menos una categoría y complete todos los campos obligatorios.",
      donationRegistered: "Donación registrada",
      successMessage: "La donación se ha registrado con éxito.",
      errorSaving: "Ocurrió un error al guardar la donación.",
      categories: "Categorías",
      comments: "Comentarios",
      commentsPlaceholder: "Agregue sus comentarios aquí..."
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0 || !quantity || !city) {
      toast({
        variant: "destructive",
        title: t.error,
        description: t.errorMessage,
      });
      return;
    }

    try {
      setLoading(true);

      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .insert({
          assistant_name: assistantName,
          city: city,
          people_helped: parseInt(quantity),
          donation_date: new Date().toISOString(),
          comments: comments,
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

      setDonationId(donation.id);
      setIsMediaOpen(true);

      toast({
        title: t.donationRegistered,
        description: t.successMessage,
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.error,
        description: t.errorSaving,
      });
      console.error('Error creating donation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUploadComplete = () => {
    setSelectedCategories([]);
    setQuantity("");
    setCity("");
    setComments("");
    setDonorName("");
    setIsAnonymous(false);
    setDonationId(null);
    setIsMediaOpen(false);
    onDonationComplete?.();
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>{t.categories}</Label>
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
          <Label htmlFor="comments">{t.comments}</Label>
          <Textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={t.commentsPlaceholder}
            className="h-24"
          />
        </div>

        <DonorInfoInput
          donorName={donorName}
          onDonorNameChange={setDonorName}
          isAnonymous={isAnonymous}
          onAnonymousChange={setIsAnonymous}
        />

        {donationId && (
          <Collapsible open={isMediaOpen} onOpenChange={setIsMediaOpen}>
            <CollapsibleTrigger className="flex items-center gap-2">
              {isMediaOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {t.addMedia}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                <DonationMediaUpload
                  donationId={donationId}
                  onUploadComplete={handleMediaUploadComplete}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        <DonationSubmitButton 
          loading={loading}
          disabled={selectedCategories.length === 0 || !quantity || !city}
        />
      </form>
    </Card>
  );
};
