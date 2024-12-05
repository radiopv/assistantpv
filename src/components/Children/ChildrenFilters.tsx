import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface ChildrenFiltersProps {
  searchTerm: string;
  selectedCity: string;
  selectedGender: string;
  selectedAge: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  cities: string[];
  ages: number[];
}

export const ChildrenFilters = ({
  searchTerm,
  selectedCity,
  selectedGender,
  selectedAge,
  selectedStatus,
  onSearchChange,
  onCityChange,
  onGenderChange,
  onAgeChange,
  onStatusChange,
  cities,
  ages,
}: ChildrenFiltersProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <Button 
          variant={selectedStatus === "available" ? "default" : "outline"}
          onClick={() => onStatusChange("available")}
        >
          Enfants à la recherche de parrain
        </Button>
        <Button 
          variant={selectedStatus === "sponsored" ? "default" : "outline"}
          onClick={() => onStatusChange("sponsored")}
        >
          Enfants parrainés
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <Select value={selectedCity} onValueChange={onCityChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder={t("city")} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">{t("allCities")}</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedGender} onValueChange={onGenderChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder={t("gender")} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">{t("allGenders")}</SelectItem>
              <SelectItem value="M">{t("masculine")}</SelectItem>
              <SelectItem value="F">{t("feminine")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAge.toString()} onValueChange={onAgeChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder={t("age")} />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-[300px]">
              <SelectItem value="all">{t("allAges")}</SelectItem>
              {ages.map((age) => (
                <SelectItem key={age} value={age.toString()}>
                  {age} {t("years")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};