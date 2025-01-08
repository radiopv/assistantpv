import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { AvailableChildrenGrid } from "@/components/Children/AvailableChildrenGrid";
import { useState, useMemo } from "react";

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
      console.log("Fetching with filters:", { selectedGender, selectedAge, selectedCity });
      
      let query = supabase
        .from("children")
        .select("*");

      // Apply base filters
      if (selectedStatus === "available") {
        query = query.eq("is_sponsored", false);
      }

      if (selectedCity !== "all") {
        query = query.eq("city", selectedCity);
      }

      // Apply gender filter
      if (selectedGender !== "all") {
        query = query.eq("gender", selectedGender);
      }

      // Apply age filter as a number
      if (selectedAge !== "all") {
        const ageNumber = parseInt(selectedAge);
        if (!isNaN(ageNumber)) {
          query = query.eq("age", ageNumber);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching children:", error);
        toast.error(t("errorFetchingChildren"));
        throw error;
      }

      // Apply search filter in memory since it's more flexible
      return data.filter(child => {
        if (searchTerm) {
          const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase());
          if (!matchesSearch) return false;
        }
        return true;
      });
    }
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("city")
        .not("city", "is", null)
        .order('city');
      
      if (error) {
        console.error("Error fetching cities:", error);
        throw error;
      }
      
      return [...new Set(data.map(item => item.city))];
    }
  });

  const { data: ages = [] } = useQuery({
    queryKey: ["ages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("age")
        .not("age", "is", null)
        .order('age');
      
      if (error) {
        console.error("Error fetching ages:", error);
        throw error;
      }
      
      return [...new Set(data.map(item => item.age))].sort((a, b) => a - b);
    }
  });

  const handleSponsorClick = async (childId: string) => {
    try {
      if (!childId) {
        toast.error(t("errorInvalidChild"));
        return;
      }

      navigate(`/become-sponsor/${childId}`);
    } catch (error) {
      console.error("Error handling sponsor click:", error);
      toast.error(t("errorSponsorClick"));
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        {t("title")}
      </h1>

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

      <AvailableChildrenGrid 
        children={children}
        isLoading={isLoading}
        onSponsorClick={handleSponsorClick}
      />
    </div>
  );
}

const translations = {
  fr: {
    title: "Enfants disponibles pour le parrainage",
    sponsor: "Parrainer cet enfant",
    age: "ans",
    needs: "Besoins",
    noChildren: "Aucun enfant disponible pour le moment",
    error: "Une erreur est survenue lors du chargement des enfants",
    sponsorSuccess: "Votre demande de parrainage a été envoyée",
    sponsorError: "Une erreur est survenue lors de la demande de parrainage",
    errorInvalidChild: "Enfant invalide",
    errorSponsorClick: "Erreur lors de la demande de parrainage",
    errorFetchingChildren: "Erreur lors du chargement des enfants"
  },
  es: {
    title: "Niños disponibles para apadrinamiento",
    sponsor: "Apadrinar a este niño",
    age: "años",
    needs: "Necesidades",
    noChildren: "No hay niños disponibles en este momento",
    error: "Ocurrió un error al cargar los niños",
    sponsorSuccess: "Su solicitud de apadrinamiento ha sido enviada",
    sponsorError: "Ocurrió un error al enviar la solicitud de apadrinamiento",
    errorInvalidChild: "Niño inválido",
    errorSponsorClick: "Error al solicitar el apadrinamiento",
    errorFetchingChildren: "Error al cargar los niños"
  }
};