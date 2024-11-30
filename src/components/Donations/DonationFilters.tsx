import { List, Grid, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { translations } from "./translations";

interface DonationFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  cities: string[];
  language: "fr" | "es";
}

export const DonationFilters = ({
  searchTerm,
  setSearchTerm,
  cityFilter,
  setCityFilter,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  cities,
  language
}: DonationFiltersProps) => {
  const t = translations[language];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <SearchInput
          placeholder={t.search.placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
          icon={Search}
        />
      </div>
      <Select value={cityFilter} onValueChange={setCityFilter}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t.filters.city} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.filters.allCities}</SelectItem>
          {cities.map(city => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t.filters.sortBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">{t.filters.date}</SelectItem>
          <SelectItem value="peopleHelped">{t.filters.peopleHelped}</SelectItem>
          <SelectItem value="city">{t.filters.city}</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};