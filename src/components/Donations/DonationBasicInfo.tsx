import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Users, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DonationBasicInfoProps {
  city: string;
  onCityChange: (value: string) => void;
  quantity: string;
  onQuantityChange: (value: string) => void;
  assistantName: string;
  onAssistantNameChange: (value: string) => void;
}

export const DonationBasicInfo = ({
  city,
  onCityChange,
  quantity,
  onQuantityChange,
  assistantName,
  onAssistantNameChange,
}: DonationBasicInfoProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      city: "Ville",
      cityPlaceholder: "Entrez le nom de la ville",
      peopleHelped: "Personnes aidées",
      peoplePlaceholder: "Nombre de personnes",
      assistantName: "Nom de l'assistant",
      assistantPlaceholder: "Nom de l'assistant"
    },
    es: {
      city: "Ciudad",
      cityPlaceholder: "Ingrese el nombre de la ciudad",
      peopleHelped: "Personas ayudadas",
      peoplePlaceholder: "Número de personas",
      assistantName: "Nombre del asistente",
      assistantPlaceholder: "Nombre del asistente"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          {t.city}
        </Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="text-base"
          placeholder={t.cityPlaceholder}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-sm font-medium flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          {t.peopleHelped}
        </Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          className="text-base"
          min="0"
          placeholder={t.peoplePlaceholder}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="assistant" className="text-sm font-medium flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          {t.assistantName}
        </Label>
        <Input
          id="assistant"
          value={assistantName}
          onChange={(e) => onAssistantNameChange(e.target.value)}
          className="text-base"
          placeholder={t.assistantPlaceholder}
        />
      </div>
    </>
  );
};