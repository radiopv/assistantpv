import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SponsorshipTypeSelectionProps {
  isLongTerm: boolean;
  isOneTime: boolean;
  onCheckboxChange: (name: string) => void;
}

export const SponsorshipTypeSelection = ({
  isLongTerm,
  isOneTime,
  onCheckboxChange,
}: SponsorshipTypeSelectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_long_term"
          checked={isLongTerm}
          onCheckedChange={() => onCheckboxChange('is_long_term')}
        />
        <Label htmlFor="is_long_term">Parrainage à long terme</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_one_time"
          checked={isOneTime}
          onCheckedChange={() => onCheckboxChange('is_one_time')}
        />
        <Label htmlFor="is_one_time">Parrainage ponctuel</Label>
      </div>

      <p className="text-sm text-gray-500">
        Vous pourrez mettre fin à votre parrainage à tout moment si nécessaire
      </p>
    </div>
  );
};