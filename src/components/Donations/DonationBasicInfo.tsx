import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Users, User } from "lucide-react";

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
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          Ville
        </Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="text-base"
          placeholder="Entrez le nom de la ville"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-sm font-medium flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          Personnes aidées
        </Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          className="text-base"
          min="0"
          placeholder="Nombre de personnes"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="assistant" className="text-sm font-medium flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          Nom de l'assistant
        </Label>
        <Input
          id="assistant"
          value={assistantName}
          onChange={(e) => onAssistantNameChange(e.target.value)}
          className="text-base"
          placeholder="Nom de l'assistant"
        />
      </div>
    </>
  );
};