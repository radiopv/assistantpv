import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Need } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { logActivity } from "@/utils/activity-logger";
import { useAuth } from "@/components/Auth/AuthProvider";

export const DetailedStats = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const { data: urgentNeeds, isLoading: urgentLoading, error: urgentError } = useQuery({
    queryKey: ['urgent-needs'],
    queryFn: async () => {
      console.log('Fetching urgent needs...');
      const { data, error } = await supabase
        .from('children')
        .select('id, name, needs')
        .not('needs', 'is', null);
      
      if (error) {
        console.error('Error fetching urgent needs:', error);
        throw error;
      }

      if (user) {
        await logActivity(user.id, "A consulté les besoins urgents");
      }

      const childrenWithUrgentNeeds = data.filter(child => {
        if (!child.needs) return false;
        
        try {
          const needs = typeof child.needs === 'string' ? JSON.parse(child.needs) : child.needs;
          return Array.isArray(needs) && needs.some((need: Need) => need.is_urgent === true);
        } catch (e) {
          console.error('Error processing needs for child:', child.name, e);
          return false;
        }
      });

      return childrenWithUrgentNeeds;
    }
  });

  const NEED_CATEGORIES = {
    education: "Éducation",
    jouet: "Juguetes",
    vetement: "Ropa",
    nourriture: "Alimentación",
    medicament: "Medicamentos",
    hygiene: "Higiene",
    autre: "Otros"
  };

  const renderError = (message: string) => (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <div className="ml-2">{message}</div>
    </Alert>
  );

  const renderSkeleton = () => (
    <div className="h-[300px] w-full">
      <Skeleton className="h-full w-full" />
    </div>
  );

  return (
    <Card className="p-4 sm:p-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <h3 className="text-base sm:text-xl font-semibold mb-4 text-gray-800">
        {language === 'fr' ? 'Besoins Urgents' : 'Necesidades Urgentes'}
      </h3>
      <div className="h-[300px] -mx-4 sm:mx-0">
        {urgentError ? renderError(language === 'fr' ? 'Erreur' : 'Error') : 
         urgentLoading ? renderSkeleton() : (
          <ScrollArea className="h-full px-4 sm:pr-4">
            <div className="space-y-4">
              {urgentNeeds?.map((child) => {
                const needs = typeof child.needs === 'string' 
                  ? JSON.parse(child.needs) 
                  : child.needs;
                
                const urgentNeeds = needs.filter((need: Need) => need.is_urgent);

                return (
                  <div key={child.id} className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-100 hover:shadow-md transition-shadow">
                    <p className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{child.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {urgentNeeds.map((need: Need, index: number) => (
                        <Badge 
                          key={`${need.category}-${index}`}
                          variant="destructive"
                          className="px-2 py-1 text-xs sm:text-sm sm:px-3"
                        >
                          {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
              {(!urgentNeeds || urgentNeeds.length === 0) && (
                <div className="text-center text-gray-500 py-8">
                  {language === 'fr' ? 'Aucun besoin urgent' : 'No hay necesidades urgentes'}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};