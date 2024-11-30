import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChildrenFilterProps {
  filters: {
    category: string;
    urgentOnly: boolean;
    searchTerm: string;
  };
  setFilters: (filters: any) => void;
  language: "fr" | "es";  // Ajout de la propriété language
}

export const ChildrenFilter = ({ filters, setFilters, language }: ChildrenFilterProps) => {
  const NEED_CATEGORIES = [
    { value: "", label: "Toutes les catégories" },
    { value: "education", label: "Éducation" },
    { value: "jouet", label: "Jouet" },
    { value: "vetement", label: "Vêtement" },
    { value: "nourriture", label: "Nourriture" },
    { value: "medicament", label: "Médicament" },
    { value: "hygiene", label: "Hygiène" },
    { value: "autre", label: "Autre" }
  ];

  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Rechercher un enfant..."
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          className="w-full"
        />
      </div>
      <Select
        value={filters.category}
        onValueChange={(value) => setFilters({ ...filters, category: value })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrer par catégorie" />
        </SelectTrigger>
        <SelectContent>
          {NEED_CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
