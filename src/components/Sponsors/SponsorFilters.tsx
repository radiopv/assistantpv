import { Search } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

export const SponsorFilters = ({
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange
}: SponsorFiltersProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <SearchInput
          placeholder={t("searchByNameEmail")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
        />
      </div>
      <Select value={sortOrder} onValueChange={onSortChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("sortBy")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">{t("mostRecent")}</SelectItem>
          <SelectItem value="name">{t("name")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};