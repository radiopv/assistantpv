import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_long_term"
          checked={isLongTerm}
          onCheckedChange={() => onCheckboxChange('is_long_term')}
        />
        <Label htmlFor="is_long_term">{t("longTermSponsorship")}</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_one_time"
          checked={isOneTime}
          onCheckedChange={() => onCheckboxChange('is_one_time')}
        />
        <Label htmlFor="is_one_time">{t("oneTimeSponsorship")}</Label>
      </div>

      <p className="text-sm text-gray-500">
        {t("sponsorshipTerminationNote")}
      </p>
    </div>
  );
};