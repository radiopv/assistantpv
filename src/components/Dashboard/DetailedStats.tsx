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
  const { t } = useLanguage();

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
    <Card className="p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('urgentNeeds')}</h3>
      <div className="h-[300px]">
        {urgentError ? renderError(t('error')) : 
         urgentLoading ? renderSkeleton() : (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {urgentNeeds?.map((child) => {
                const needs = typeof child.needs === 'string' 
                  ? JSON.parse(child.needs) 
                  : child.needs;
                
                const urgentNeeds = needs.filter((need: Need) => need.is_urgent);

                return (
                  <div key={child.id} className="p-4 bg-red-50 rounded-lg border border-red-100 hover:shadow-md transition-shadow">
                    <p className="font-medium text-gray-900 mb-2">{child.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {urgentNeeds.map((need: Need, index: number) => (
                        <Badge 
                          key={`${need.category}-${index}`}
                          variant="destructive"
                          className="px-3 py-1"
                        >
                          {need.category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
              {(!urgentNeeds || urgentNeeds.length === 0) && (
                <div className="text-center text-gray-500 py-8">
                  {t('noUrgentNeeds')}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};