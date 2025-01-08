import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { differenceInYears, parseISO } from "date-fns";
import { convertJsonToNeeds } from "@/types/needs";

export default function ChildDetails() {
  const { id } = useParams();
  const { t } = useLanguage();

  const { data: child, isLoading } = useQuery({
    queryKey: ["child", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  const age = child?.birth_date 
    ? differenceInYears(new Date(), parseISO(child.birth_date))
    : null;

  const needs = convertJsonToNeeds(child?.needs);

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={child?.photo_url || "/placeholder.svg"}
              alt={child?.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{child?.name}</h1>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t("age")}</p>
                <p className="font-medium">{age} {t("years")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t("city")}</p>
                <p className="font-medium">{child?.city}</p>
              </div>
            </div>

            {child?.description && (
              <div>
                <p className="text-sm text-gray-500">{t("description")}</p>
                <p className="mt-1">{child.description}</p>
              </div>
            )}

            {needs?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">{t("needs")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {needs.map((need, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        need.is_urgent ? "bg-red-100" : "bg-gray-100"
                      }`}
                    >
                      {need.category}
                      {need.description && (
                        <p className="text-xs mt-1">{need.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}