import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChildrenFiltersProps {
  searchTerm: string;
  selectedCity: string;
  selectedGender: string;
  selectedAge: string;
  onSearchChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  cities: string[];
  ages: number[];
}

export const ChildrenFilters = ({
  searchTerm,
  selectedCity,
  selectedGender,
  selectedAge,
  onSearchChange,
  onCityChange,
  onGenderChange,
  onAgeChange,
  cities,
  ages,
}: ChildrenFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher un enfant..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <Select value={selectedCity} onValueChange={onCityChange}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Toutes les villes</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGender} onValueChange={onGenderChange}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="M">Masculin</SelectItem>
            <SelectItem value="F">Féminin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedAge} onValueChange={onAgeChange}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Âge" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tous les âges</SelectItem>
            {ages.map((age) => (
              <SelectItem key={age} value={age.toString()}>
                {age} ans
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};