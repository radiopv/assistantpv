import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  const translations = {
    fr: {
      searchPlaceholder: "Rechercher un enfant...",
      city: "Ville",
      allCities: "Toutes les villes",
      gender: "Genre",
      allGenders: "Tous les genres",
      masculine: "Masculin",
      feminine: "Féminin",
      age: "Âge",
      allAges: "Tous les âges",
      years: "ans",
      status: "Statut",
      allStatus: "Tous les statuts",
      available: "Disponible",
      sponsored: "Parrainé",
      pending: "En attente",
      urgent: "Urgent"
    },
    es: {
      searchPlaceholder: "Buscar un niño...",
      city: "Ciudad",
      allCities: "Todas las ciudades",
      gender: "Género",
      allGenders: "Todos los géneros",
      masculine: "Masculino",
      feminine: "Femenino",
      age: "Edad",
      allAges: "Todas las edades",
      years: "años",
      status: "Estado",
      allStatus: "Todos los estados",
      available: "Disponible",
      sponsored: "Apadrinado",
      pending: "Pendiente",
      urgent: "Urgente"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white min-h-[44px]"
        />
      </div>
      <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'sm:flex sm:flex-wrap sm:gap-4'}`}>
        <Select value={selectedCity} onValueChange={onCityChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white min-h-[44px]">
            <SelectValue placeholder={t.city} />
          </SelectTrigger>
          <SelectContent className="bg-white max-h-[300px]">
            <SelectItem value="all">{t.allCities}</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGender} onValueChange={onGenderChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white min-h-[44px]">
            <SelectValue placeholder={t.gender} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">{t.allGenders}</SelectItem>
            <SelectItem value="M">{t.masculine}</SelectItem>
            <SelectItem value="F">{t.feminine}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedAge.toString()} onValueChange={onAgeChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white min-h-[44px]">
            <SelectValue placeholder={t.age} />
          </SelectTrigger>
          <SelectContent className="bg-white max-h-[300px]">
            <SelectItem value="all">{t.allAges}</SelectItem>
            {ages.map((age) => (
              <SelectItem key={age} value={age.toString()}>
                {age} {t.years}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white min-h-[44px]">
            <SelectValue placeholder={t.status} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">{t.allStatus}</SelectItem>
            <SelectItem value="available">{t.available}</SelectItem>
            <SelectItem value="sponsored">{t.sponsored}</SelectItem>
            <SelectItem value="pending">{t.pending}</SelectItem>
            <SelectItem value="urgent">{t.urgent}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};