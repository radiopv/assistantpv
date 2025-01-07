import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, MapPin, Calendar } from "lucide-react";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Need } from "@/types/needs";

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

export default function AvailableChildren() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState("available");

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("city")
        .not("city", "is", null);
      
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

  const { data: children = [], isLoading, error } = useQuery({
    queryKey: ["available-children", searchTerm, selectedCity, selectedGender, selectedAge, selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from("children")
        .select("*")
        .eq("status", "available");

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
      navigate(`/become-sponsor/${childId}`);
      toast.success(t.sponsorSuccess);
    } catch (error) {
      console.error("Error initiating sponsorship:", error);
      toast.error(t.sponsorError);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {t.error}
      </div>
    );
  }

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="p-4 space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : children.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          {t.noChildren}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => {
            const childNeeds = Array.isArray(child.needs) ? child.needs : [];
            
            return (
              <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={child.photo_url || "/placeholder.svg"}
                    alt={child.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{child.name}</h3>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{child.age} {t.age}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{child.city}</span>
                  </div>

                  {childNeeds.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">{t.needs}:</p>
                      <div className="flex flex-wrap gap-2">
                        {childNeeds.map((need: Need, index: number) => (
                          <Badge 
                            key={`${need.category}-${index}`}
                            variant={need.is_urgent ? "destructive" : "secondary"}
                          >
                            {need.category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    onClick={() => handleSponsorClick(child.id)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {t.sponsor}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}