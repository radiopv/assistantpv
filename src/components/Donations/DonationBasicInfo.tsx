import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <Label htmlFor="city">Ville</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="Ville où le don a été fait"
        />
      </div>

      <div>
        <Label htmlFor="quantity">Nombre de personnes aidées</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          min="1"
        />
      </div>

      <div>
        <Label htmlFor="assistantName">Assistant</Label>
        <Input
          id="assistantName"
          value={assistantName}
          onChange={(e) => onAssistantNameChange(e.target.value)}
          placeholder="Nom de l'assistant"
        />
      </div>
    </div>
  );
};