import { Search } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DonationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cityFilter: string;
  onCityFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  cities: string[];
}

export const DonationFilters = ({
  searchTerm,
  onSearchChange,
  cityFilter,
  onCityFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  cities,
}: DonationFiltersProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      searchPlaceholder: "Rechercher des dons...",
      filterByCity: "Filtrer par ville",
      allCities: "Toutes les villes",
      sortBy: "Trier par",
      date: "Date",
      peopleHelped: "Personnes aidées",
      city: "Ville",
      grid: "Grille",
      list: "Liste"
    },
    es: {
      searchPlaceholder: "Buscar donaciones...",
      filterByCity: "Filtrar por ciudad",
      allCities: "Todas las ciudades",
      sortBy: "Ordenar por",
      date: "Fecha",
      peopleHelped: "Personas ayudadas",
      city: "Ciudad",
      grid: "Cuadrícula",
      list: "Lista"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <SearchInput
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
          icon={Search}
        />
      </div>
      <Select value={cityFilter} onValueChange={onCityFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t.filterByCity} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.allCities}</SelectItem>
          {cities.map(city => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t.sortBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">{t.date}</SelectItem>
          <SelectItem value="peopleHelped">{t.peopleHelped}</SelectItem>
          <SelectItem value="city">{t.city}</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
          title={t.grid}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("list")}
          title={t.list}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};