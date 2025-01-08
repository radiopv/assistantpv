import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useAuth } from "@/components/Auth/AuthProvider";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { AvailableChildrenGrid } from "@/components/Children/AvailableChildrenGrid";
import { useState } from "react";

export default function AvailableChildren() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language as keyof typeof translations];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("available");

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("city")
        .not("city", "is", null)
        .order('city');
      
      if (error) throw error;
      return [...new Set(data.map(item => item.city))];
    }
  });

  const { data: ages = [] } = useQuery({
    queryKey: ["ages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("age")
        .not("age", "is", null);
      
      if (error) throw error;
      return [...new Set(data.map(item => item.age))].sort((a, b) => a - b);
    }
  });

  const { data: children = [], isLoading } = useQuery({
    queryKey: ["available-children", searchTerm, selectedCity, selectedGender, selectedAge, selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from("children")
        .select("*");

      if (selectedStatus !== "all") {
        query = query.eq("status", selectedStatus);
      }

      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      if (selectedCity !== "all") {
        query = query.eq("city", selectedCity);
      }

      if (selectedGender !== "all") {
        query = query.eq("gender", selectedGender);
      }

      if (selectedAge !== "all") {
        query = query.eq("age", parseInt(selectedAge));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const handleSponsorClick = async (childId: string) => {
    try {
      if (!user) {
        navigate(`/become-sponsor/${childId}`);
        return;
      }

      const { error } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: childId,
          sponsor_id: user.id,
          full_name: user.name,
          email: user.email,
          status: 'pending',
          terms_accepted: true
        });

      if (error) throw error;

      toast.success(t.sponsorSuccess);
    } catch (error) {
      console.error("Error initiating sponsorship:", error);
      toast.error(t.sponsorError);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        {t.title}
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
    sponsorError: "Une erreur est survenue lors de la demande de parrainage"
  },
  es: {
    title: "Niños disponibles para apadrinamiento",
    sponsor: "Apadrinar a este niño",
    age: "años",
    needs: "Necesidades",
    noChildren: "No hay niños disponibles en este momento",
    error: "Ocurrió un error al cargar los niños",
    sponsorSuccess: "Su solicitud de apadrinamiento ha sido enviada",
    sponsorError: "Ocurrió un error al enviar la solicitud de apadrinamiento"
  }
};