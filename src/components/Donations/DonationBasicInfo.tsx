import { Label } from "@/components/ui/label";
import { MapPin, Users, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      cityPlaceholder: "Nom de la ville",
      peopleHelped: "Personnes aidées",
      peoplePlaceholder: "Nombre de personnes",
      assistantName: "Nom de l'assistant",
      selectAssistant: "Sélectionnez un assistant"
    },
    es: {
      city: "Ciudad",
      cityPlaceholder: "Nombre de la ciudad",
      peopleHelped: "Personas ayudadas",
      peoplePlaceholder: "Número de personas",
      assistantName: "Nombre del asistente",
      selectAssistant: "Seleccione un asistente"
    }
  };

  const t = translations[language as keyof typeof translations];

  const assistantOptions = [
    "Vitia et Pancho",
    "Vitia et Pancho et Demailys"
  ];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="city" className="flex items-center gap-2">
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
        <Label htmlFor="quantity" className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          {t.peopleHelped}
        </Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          className="text-base"
          placeholder={t.peoplePlaceholder}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assistant" className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          {t.assistantName}
        </Label>
        <Select 
          value={assistantName} 
          onValueChange={onAssistantNameChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t.selectAssistant} />
          </SelectTrigger>
          <SelectContent>
            {assistantOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};