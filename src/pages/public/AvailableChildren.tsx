import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { AvailableChildrenGrid } from "@/components/Children/AvailableChildrenGrid";
import { useState, useMemo } from "react";
import { differenceInYears, parseISO } from "date-fns";

interface CategorizedChildren {
  infants: any[];
  toddlers: any[];
  children: any[];
  teens: any[];
  unknown: any[];
}

export default function AvailableChildren() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
        console.log("Recherche par nom:", searchTerm);
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (selectedStatus === "available") {
        query = query.eq("is_sponsored", false);
      } else if (selectedStatus === "urgent") {
        query = query
          .eq("is_sponsored", false)
          .not('needs', 'is', null)
          .neq('needs', '[]');
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
        toast.error(t("errorFetchingChildren"));
        throw error;
      }

      // Filter children with urgent needs if status is "urgent"
      if (selectedStatus === "urgent") {
        return data.filter((child: any) => {
          if (!child.needs || !Array.isArray(child.needs)) return false;
          return child.needs.some((need: any) => need.is_urgent === true);
        });
      }

      console.log("Résultats de la requête:", data);
      return data || [];
    }
  });

  const categorizedChildren = useMemo(() => {
    if (!children) return {
      infants: [],
      toddlers: [],
      children: [],
      teens: [],
      unknown: []
    } as CategorizedChildren;

    return children.reduce((acc: CategorizedChildren, child) => {
      if (!child.birth_date) {
        acc.unknown = acc.unknown || [];
        acc.unknown.push(child);
        return acc;
      }

      const birthDate = parseISO(child.birth_date);
      const ageInYears = differenceInYears(new Date(), birthDate);
      
      console.log(`Calcul de l'âge pour ${child.name}:`, ageInYears);

      if (ageInYears <= 2) {
        acc.infants = acc.infants || [];
        acc.infants.push(child);
      } else if (ageInYears <= 5) {
        acc.toddlers = acc.toddlers || [];
        acc.toddlers.push(child);
      } else if (ageInYears <= 12) {
        acc.children = acc.children || [];
        acc.children.push(child);
      } else {
        acc.teens = acc.teens || [];
        acc.teens.push(child);
      }

      return acc;
    }, {
      infants: [],
      toddlers: [],
      children: [],
      teens: [],
      unknown: []
    } as CategorizedChildren);
  }, [children]);

  const filteredChildren = useMemo(() => {
    if (selectedAge === "all") {
      return children;
    }
    
    const ageRanges = {
      "0-2": categorizedChildren.infants,
      "3-5": categorizedChildren.toddlers,
      "6-12": categorizedChildren.children,
      "13+": categorizedChildren.teens
    };
    
    return ageRanges[selectedAge as keyof typeof ageRanges] || [];
  }, [children, selectedAge, categorizedChildren]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white">
      <div className="container mx-auto p-4 space-y-6">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-8 rounded-xl shadow-lg text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold font-title mb-4">
            {t("availableChildren")}
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            {t("availableChildrenDescription")}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-orange-200">
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
          <div className="text-center py-8 text-gray-500 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-orange-200">
            {selectedStatus === "urgent" ? t("noUrgentChildren") : t("noCategoryChildren")}
          </div>
        )}
      </div>
    </div>
  );
}