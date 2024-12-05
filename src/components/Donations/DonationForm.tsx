import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DonationCategorySelect } from "./DonationCategorySelect";
import { DonationBasicInfo } from "./DonationBasicInfo";
import { DonorInfo } from "./DonorInfo";
import { PhotoUpload } from "./PhotoUpload";
import { DonationSubmitButton } from "./DonationSubmitButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDonationForm } from "./hooks/useDonationForm";

interface DonationFormProps {
  onDonationComplete?: () => void;
}

export const DonationForm = ({ onDonationComplete }: DonationFormProps) => {
  const { language } = useLanguage();
  const {
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
  } = useDonationForm(onDonationComplete);

  const translations = {
    fr: {
      categories: "Catégories",
      comments: "Commentaires",
      commentsPlaceholder: "Détails supplémentaires sur le don",
    },
    es: {
      categories: "Categorías",
      comments: "Comentarios",
      commentsPlaceholder: "Detalles adicionales sobre la donación",
    }
  };

  const t = translations[language as keyof typeof translations];

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