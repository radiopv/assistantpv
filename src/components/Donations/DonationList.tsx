import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DonationCard } from "./DonationCard";
import { DonationFilters } from "./DonationFilters";
import { translations } from "./translations";

interface DonationListProps {
  donations: any[];
  onDelete: () => void;
  language: "fr" | "es";
}

export const DonationList = ({ donations, onDelete, language }: DonationListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("date");

  const cities = [...new Set(donations.map(d => d.city))].sort();

  const filteredDonations = donations?.filter(donation => {
    const matchesSearch = 
      donation.assistant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.comments?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === "all" || donation.city === cityFilter;
    
    return matchesSearch && matchesCity;
  });

  const sortedDonations = filteredDonations?.sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.donation_date).getTime() - new Date(a.donation_date).getTime();
      case "peopleHelped":
        return b.people_helped - a.people_helped;
      case "city":
        return a.city.localeCompare(b.city);
      default:
        return 0;
    }
  });

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <DonationFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          cities={cities}
          language={language}
        />

        {sortedDonations && sortedDonations.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
            {sortedDonations.map((donation) => (
              <DonationCard 
                key={donation.id} 
                donation={donation}
                onDelete={onDelete}
                language={language}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            {translations[language].noResults}
          </p>
        )}
      </div>
    </Card>
  );
};