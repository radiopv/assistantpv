import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "@/components/Translation/TranslationContext";

interface Need {
  id: string;
  category: string;
  description: string;
  is_urgent: boolean;
  child_id: string;
  child_name: string;
}

export const NeedsList = () => {
  const { t } = useTranslation();
  
  const { data: needs } = useQuery({
    queryKey: ['children-needs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select(`
          id,
          name,
          needs
        `)
        .not('needs', 'is', null);

      if (error) throw error;

      const formattedNeeds: Need[] = [];
      data?.forEach(child => {
        if (Array.isArray(child.needs)) {
          child.needs.forEach((need: any) => {
            formattedNeeds.push({
              id: need.id || Math.random().toString(),
              category: need.category,
              description: need.description,
              is_urgent: need.is_urgent,
              child_id: child.id,
              child_name: child.name
            });
          });
        }
      });

      return formattedNeeds;
    }
  });

  const urgentNeeds = needs?.filter(need => need.is_urgent) || [];
  const regularNeeds = needs?.filter(need => !need.is_urgent) || [];

  return (
    <div className="space-y-6">
      {urgentNeeds.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            {t("needs.urgent_needs")}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {urgentNeeds.map(need => (
              <Card key={need.id} className="p-4 border-red-200 bg-red-50">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="destructive">{t(`needs.categories.${need.category}`)}</Badge>
                  <Badge variant="outline">{need.child_name}</Badge>
                </div>
                <p className="text-sm text-gray-700">{need.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {regularNeeds.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("needs.other_needs")}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {regularNeeds.map(need => (
              <Card key={need.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge>{t(`needs.categories.${need.category}`)}</Badge>
                  <Badge variant="outline">{need.child_name}</Badge>
                </div>
                <p className="text-sm text-gray-700">{need.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(!needs || needs.length === 0) && (
        <div className="text-center text-gray-500 py-8">
          {t("needs.no_needs")}
        </div>
      )}
    </div>
  );
};