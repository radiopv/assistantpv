import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { AvailableChildrenGrid } from "@/components/Children/AvailableChildrenGrid";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      if (selectedGender !== "all") {
        query = query.eq("gender", selectedGender);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching children:", error);
        toast.error(t("errorFetchingChildren"));
        throw error;
      }

      // Log the fetched data for debugging
      console.log("Fetched children data:", data);

      return data;
    }
  });

  const categorizedChildren = useMemo(() => {
    if (!children) return {};

    return children.reduce((acc, child) => {
      if (!child.birth_date) {
        acc.unknown = acc.unknown || [];
        acc.unknown.push(child);
        return acc;
      }

      const birthDate = new Date(child.birth_date);
      const today = new Date();
      const ageInYears = today.getFullYear() - birthDate.getFullYear();
      
      // Log age calculation for debugging
      console.log(`Age calculation for ${child.name}:`, ageInYears);

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
    }, {});
  }, [children]);

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
        {t("availableChildren")}
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
        cities={[]}
        ages={[]}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">{t("allAges")}</TabsTrigger>
          <TabsTrigger value="infants">{t("infants")}</TabsTrigger>
          <TabsTrigger value="toddlers">{t("toddlers")}</TabsTrigger>
          <TabsTrigger value="children">{t("children")}</TabsTrigger>
          <TabsTrigger value="teens">{t("teens")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AvailableChildrenGrid 
            children={children}
            isLoading={isLoading}
            onSponsorClick={handleSponsorClick}
          />
        </TabsContent>

        {["infants", "toddlers", "children", "teens"].map((category) => (
          <TabsContent key={category} value={category}>
            {categorizedChildren[category]?.length > 0 ? (
              <AvailableChildrenGrid 
                children={categorizedChildren[category]}
                isLoading={isLoading}
                onSponsorClick={handleSponsorClick}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t("noCategoryChildren")}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

const translations = {
  fr: {
    availableChildren: "Enfants disponibles pour le parrainage",
    allAges: "Tous les âges",
    infants: "Nourrissons (0-2 ans)",
    toddlers: "Jeunes enfants (3-5 ans)",
    children: "Enfants (6-12 ans)",
    teens: "Adolescents (13+ ans)",
    noCategoryChildren: "Aucun enfant dans cette catégorie",
    sponsor: "Parrainer cet enfant",
    age: "ans",
    needs: "Besoins",
    noChildren: "Aucun enfant disponible pour le moment",
    error: "Une erreur est survenue lors du chargement des enfants",
    sponsorSuccess: "Votre demande de parrainage a été envoyée",
    sponsorError: "Une erreur est survenue lors de la demande de parrainage",
    errorInvalidChild: "Enfant invalide",
    errorSponsorClick: "Erreur lors de la demande de parrainage",
    errorFetchingChildren: "Erreur lors du chargement des enfants",
    sexe: "Sexe"
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