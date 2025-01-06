import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle, GraduationCap, Shirt, Apple, Stethoscope, Sparkles, Book, HelpCircle, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Need } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { logActivity } from "@/utils/activity-logger";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const DetailedStats = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const { data: urgentNeeds, isLoading: urgentLoading, error: urgentError, refetch } = useQuery({
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

  const getNeedIcon = (category: string) => {
    switch (category) {
      case "education":
        return <GraduationCap className="text-yellow-500" />;
      case "jouet":
        return <Sparkles className="text-purple-500" />;
      case "vetement":
        return <Shirt className="text-blue-500" />;
      case "nourriture":
        return <Apple className="text-green-500" />;
      case "medicament":
        return <Stethoscope className="text-red-500" />;
      case "hygiene":
        return <Book className="text-cyan-500" />;
      default:
        return <HelpCircle className="text-gray-500" />;
    }
  };

  const NEED_CATEGORIES = {
    education: "Éducation",
    jouet: "Juguetes",
    vetement: "Ropa",
    nourriture: "Alimentación",
    medicament: "Medicamentos",
    hygiene: "Higiene",
    autre: "Otros"
  };

  const handleToggleUrgent = async (childId: string, needCategory: string, currentNeeds: Need[]) => {
    try {
      const updatedNeeds = currentNeeds.map(need => 
        need.category === needCategory 
          ? { ...need, is_urgent: !need.is_urgent }
          : need
      );

      const { error } = await supabase
        .from('children')
        .update({ needs: updatedNeeds })
        .eq('id', childId);

      if (error) throw error;

      await refetch();
      toast({
        title: language === 'fr' ? 'Besoin mis à jour' : 'Necesidad actualizada',
        description: language === 'fr' 
          ? 'Le statut urgent du besoin a été modifié avec succès' 
          : 'El estado urgente de la necesidad se ha modificado con éxito',
      });
    } catch (error) {
      console.error('Error updating need:', error);
      toast({
        variant: "destructive",
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' 
          ? 'Une erreur est survenue lors de la mise à jour du besoin' 
          : 'Ocurrió un error al actualizar la necesidad',
      });
    }
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
                      {needs.map((need: Need, index: number) => (
                        <div key={`${need.category}-${index}`} className="flex items-center gap-2">
                          <Badge 
                            variant={need.is_urgent ? "destructive" : "default"}
                            className="px-2 py-1 text-xs sm:text-sm sm:px-3 flex items-center gap-2"
                          >
                            {getNeedIcon(need.category)}
                            {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleToggleUrgent(child.id, need.category, needs)}
                          >
                            {need.is_urgent ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </Button>
                        </div>
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