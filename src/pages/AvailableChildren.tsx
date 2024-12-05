import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChildrenFilters } from "@/components/Children/ChildrenFilters";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { differenceInYears, parseISO } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Need, convertJsonToNeeds } from "@/types/needs";

const AvailableChildren = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("available");

  const { data: children, isLoading } = useQuery({
    queryKey: ['available-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const cities = Array.from(new Set(children?.map(child => child.city) || [])).filter(Boolean);
  const ages = Array.from(new Set(children?.map(child => {
    const age = differenceInYears(new Date(), parseISO(child.birth_date));
    return age;
  }) || [])).filter(Boolean).sort((a, b) => a - b);

  const filteredChildren = children?.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || child.city === selectedCity;
    const matchesGender = selectedGender === "all" || child.gender === selectedGender;
    const matchesAge = selectedAge === "all" || differenceInYears(new Date(), parseISO(child.birth_date)) === parseInt(selectedAge);
    const matchesStatus = selectedStatus === "available" ? !child.is_sponsored : child.is_sponsored;
    
    return matchesSearch && matchesCity && matchesGender && matchesAge && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("availableChildren")}
        </h1>
        <p className="text-gray-600">
          {t("availableChildrenDescription")}
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChildren?.map((child) => (
          <Card key={child.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{child.name}</h3>
                <div className="mt-1 text-sm text-gray-600">
                  <p>{differenceInYears(new Date(), parseISO(child.birth_date))} {t("years")}</p>
                  <p>{child.city}</p>
                  <p>{child.gender === 'M' ? t("masculine") : t("feminine")}</p>
                </div>
              </div>

              {child.needs && (
                <div>
                  <h4 className="font-medium mb-2">{t("needs")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {convertJsonToNeeds(child.needs).map((need, index) => (
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

              {child.description && (
                <div>
                  <h4 className="font-medium mb-2">{t("description")}</h4>
                  <ScrollArea className="h-24">
                    <p className="text-sm text-gray-600">{child.description}</p>
                  </ScrollArea>
                </div>
              )}

              {child.story && (
                <div>
                  <h4 className="font-medium mb-2">{t("story")}</h4>
                  <ScrollArea className="h-24">
                    <p className="text-sm text-gray-600">{child.story}</p>
                  </ScrollArea>
                </div>
              )}

              <Button 
                className="w-full"
                onClick={() => navigate(`/become-sponsor/${child.id}`)}
              >
                {t("becomeSponsor")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableChildren;