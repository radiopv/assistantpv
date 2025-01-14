import { Search } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  ages: string[];
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
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <SearchInput
          placeholder="Rechercher un enfant..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white min-h-[44px]"
        />
      </div>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4">
        <Select value={selectedCity} onValueChange={onCityChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white min-h-[44px]">
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent className="bg-white max-h-[300px]">
            <SelectItem value="all">Toutes les villes</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGender} onValueChange={onGenderChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white min-h-[44px]">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tous les genres</SelectItem>
            <SelectItem value="male">Garçon</SelectItem>
            <SelectItem value="female">Fille</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedAge} onValueChange={onAgeChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white min-h-[44px]">
            <SelectValue placeholder="Âge" />
          </SelectTrigger>
          <SelectContent className="bg-white max-h-[300px]">
            <SelectItem value="all">Tous les âges</SelectItem>
            {ages.map((ageRange) => (
              <SelectItem key={ageRange} value={ageRange}>
                {ageRange === "13+" ? "13 ans et plus" : `${ageRange} ans`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white min-h-[44px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="urgent">Besoins urgents</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};