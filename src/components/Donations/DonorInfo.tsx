import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface DonorInfoProps {
  donorName: string;
  onDonorNameChange: (value: string) => void;
  isAnonymous: boolean;
  onAnonymousChange: (value: boolean) => void;
}

export const DonorInfo = ({
  donorName,
  onDonorNameChange,
  isAnonymous,
  onAnonymousChange,
}: DonorInfoProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      donorInfo: "Information du donateur",
      donorPlaceholder: "Nom du donateur (optionnel)",
      anonymous: "Anonyme"
    },
    es: {
      donorInfo: "Información del donante",
      donorPlaceholder: "Nombre del donante (opcional)",
      anonymous: "Anónimo"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="space-y-4">
      <Label>{t.donorInfo}</Label>
      <div className="flex items-center gap-4">
        <Input
          placeholder={t.donorPlaceholder}
          value={donorName}
          onChange={(e) => onDonorNameChange(e.target.value)}
          disabled={isAnonymous}
        />
        <Button
          type="button"
          variant={isAnonymous ? "default" : "outline"}
          onClick={() => onAnonymousChange(!isAnonymous)}
        >
          {t.anonymous}
        </Button>
      </div>
    </div>
  );
};