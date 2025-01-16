import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { AvailableChildrenGrid } from "@/components/Children/AvailableChildrenGrid";
import { useState, useMemo } from "react";
import { differenceInYears, parseISO } from "date-fns";

export default function AvailableChildren() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("available");

  const { data: children = [], isLoading } = useQuery({
    queryKey: ["available-children", searchTerm, selectedCity, selectedGender, selectedAge, selectedStatus],
    queryFn: async () => {
      console.log("Recherche d'enfants avec les filtres:", { searchTerm, selectedGender, selectedAge, selectedCity, selectedStatus });
      
      let query = supabase
        .from("children")
        .select("*");

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (selectedStatus === "available") {
        query = query.eq("is_sponsored", false);
      } else if (selectedStatus === "urgent") {
        query = query
          .eq("is_sponsored", false)
          .not('needs', 'is', null)
          .neq('needs', '[]')
          .filter('needs', 'cs', '{"is_urgent":true}');
      }

      if (selectedCity !== "all") {
        query = query.eq("city", selectedCity);
      }

      if (selectedGender !== "all") {
        query = query.eq("gender", selectedGender);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erreur lors de la récupération des enfants:", error);
        toast.error("Erreur lors de la récupération des enfants");
        throw error;
      }

      return data || [];
    }
  });

  const filteredChildren = useMemo(() => {
    if (selectedAge === "all") {
      return children;
    }
    
    const ageRanges: { [key: string]: any[] } = {
      "0-2": children.filter(child => {
        const age = differenceInYears(new Date(), parseISO(child.birth_date));
        return age <= 2;
      }),
      "3-5": children.filter(child => {
        const age = differenceInYears(new Date(), parseISO(child.birth_date));
        return age > 2 && age <= 5;
      }),
      "6-12": children.filter(child => {
        const age = differenceInYears(new Date(), parseISO(child.birth_date));
        return age > 5 && age <= 12;
      }),
      "13+": children.filter(child => {
        const age = differenceInYears(new Date(), parseISO(child.birth_date));
        return age > 12;
      })
    };
    
    return ageRanges[selectedAge] || [];
  }, [children, selectedAge]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white">
      <div className="container mx-auto p-0 sm:p-4 space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-none sm:rounded-xl shadow-lg p-4 sm:p-6 border border-orange-200">
          <ChildrenFilters
            searchTerm={searchTerm}
            selectedCity={selectedCity}
            selectedGender={selectedGender}
            selectedAge={selectedAge}
            selectedStatus={selectedStatus}
            onSearchChange={setSearchTerm}
            onCityChange={setSelectedCity}
            onGenderChange={setSelectedGender}
            onAgeChange={setSelectedAge}
            onStatusChange={setSelectedStatus}
            cities={[]}
            ages={["0-2", "3-5", "6-12", "13+"]}
          />
        </div>

        {!isLoading && children && (
          <div className="animate-fade-in">
            <AvailableChildrenGrid 
              children={filteredChildren}
              isLoading={isLoading}
              onSponsorClick={(childId) => navigate(`/become-sponsor/${childId}`)}
            />
          </div>
        )}

        {!children?.length && (
          <div className="text-center py-8 text-gray-500 bg-white/80 backdrop-blur-sm rounded-none sm:rounded-xl shadow-lg p-6 border border-orange-200">
            {selectedStatus === "urgent" ? 
              "Aucun enfant n'a de besoins urgents pour le moment" : 
              "Aucun enfant disponible ne correspond à vos critères"}
          </div>
        )}
      </div>
    </div>
  );
}