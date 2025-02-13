import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Globe } from "lucide-react";
import { useState, useMemo } from "react";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChildrenList } from "@/components/Children/ChildrenList";
import { useLanguage } from "@/contexts/LanguageContext";
import { ErrorAlert } from "@/components/ErrorAlert";

const Children = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t, language, setLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data: children, isLoading, error, refetch } = useQuery({
    queryKey: ['children', searchTerm, selectedCity, selectedGender, selectedAge, selectedStatus],
    queryFn: async () => {
      console.log("Fetching with filters:", { selectedGender, selectedAge, selectedCity, selectedStatus });
      
      let query = supabase
        .from('children')
        .select('*');

      // Apply filters directly in the query
      if (selectedCity !== "all") {
        query = query.eq("city", selectedCity);
      }

      // Convert gender filter from frontend values to database values
      if (selectedGender === "masculine") {
        query = query.eq("gender", "M");
      } else if (selectedGender === "feminine") {
        query = query.eq("gender", "F");
      }

      // Apply age filter as a number
      if (selectedAge !== "all") {
        query = query.eq("age", parseInt(selectedAge));
      }

      // Apply status filter
      if (selectedStatus === "available") {
        query = query.eq("is_sponsored", false);
      } else if (selectedStatus === "sponsored") {
        query = query.eq("is_sponsored", true);
      } else if (selectedStatus === "pending") {
        query = query.eq("status", "En attente");
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching children:", error);
        throw error;
      }

      return data?.filter(child => 
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];
    }
  });

  // Get unique cities and ages for filters
  const cities = useMemo(() => {
    if (!children) return [];
    const uniqueCities = [...new Set(children.map(child => child.city))];
    return uniqueCities.filter(Boolean).sort();
  }, [children]);

  const ages = useMemo(() => {
    if (!children) return [];
    const uniqueAges = [...new Set(children.map(child => child.age))];
    return uniqueAges.filter(Boolean).sort((a, b) => a - b).map(age => age.toString());
  }, [children]);

  if (error) {
    return (
      <ErrorAlert 
        message={t("errorLoadingChildren")} 
        retry={refetch}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{t("childrenList")}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === 'fr' ? 'es' : 'fr')}
            className="min-h-[44px] min-w-[44px]"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => navigate('/children/add')}
            className="w-full sm:w-auto min-h-[44px]"
          >
            {t("addChild")}
          </Button>
        </div>
      </div>

      {/* Hero Section for Available Children */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-6 sm:p-8 rounded-xl shadow-lg text-center mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold font-title mb-4">
          Enfants en attente de parrainage
        </h1>
        <p className="text-white/90 max-w-2xl mx-auto text-lg">
          Découvrez les enfants qui attendent votre soutien et votre amour
        </p>
      </div>

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
        cities={cities}
        ages={ages}
      />

      <ChildrenList 
        children={children || []}
        isLoading={isLoading}
        onViewProfile={(id) => navigate(`/children/${id}`)}
      />
    </div>
  );
};

export default Children;