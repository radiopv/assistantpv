import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";

interface BasicInfoProps {
  age: string;
  city: string;
  sponsorName?: string;
  isSponsored: boolean;
  isEditing: boolean;
  onCityChange: (value: string) => void;
}

export const BasicInfo = ({ 
  age, 
  city, 
  sponsorName, 
  isSponsored, 
  isEditing, 
  onCityChange 
}: BasicInfoProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
      <div>
        <p className="text-gray-400">{t("age")}</p>
        <p className="font-medium">{age}</p>
      </div>
      <div>
        <p className="text-gray-400">{t("city")}</p>
        {isEditing ? (
          <Input
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="mt-1"
          />
        ) : (
          <p className="font-medium">{city}</p>
        )}
      </div>
      {isSponsored && sponsorName && (
        <div className="col-span-2">
          <p className="text-gray-400">{t("sponsor")}</p>
          <p className="font-medium text-blue-600">{sponsorName}</p>
        </div>
      )}
    </div>
  );
};