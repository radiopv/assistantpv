import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle, GraduationCap, Shirt, Apple, Stethoscope, Sparkles, Book, HelpCircle, Plus, Minus } from "lucide-react";
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
    education: language === 'fr' ? "Éducation" : "Educación",
    jouet: language === 'fr' ? "Jouets" : "Juguetes",
    vetement: language === 'fr' ? "Vêtements" : "Ropa",
    nourriture: language === 'fr' ? "Nourriture" : "Alimentación",
    medicament: language === 'fr' ? "Médicaments" : "Medicamentos",
    hygiene: language === 'fr' ? "Hygiène" : "Higiene",
    autre: language === 'fr' ? "Autres" : "Otros"
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
    <div className="h-[600px] w-full">
      <Skeleton className="h-full w-full" />
    </div>
  );

  return (
    <Card className="p-4 sm:p-6 bg-white shadow-lg rounded-lg overflow-hidden h-[calc(100vh-12rem)]">
      <h3 className="text-base sm:text-xl font-semibold mb-4 text-gray-800">
        {language === 'fr' ? 'Besoins Urgents' : 'Necesidades Urgentes'}
      </h3>
      <div className="h-[calc(100%-3rem)] -mx-4 sm:mx-0">
        {urgentError ? renderError(language === 'fr' ? 'Erreur' : 'Error') : 
         urgentLoading ? renderSkeleton() : (
          <ScrollArea className="h-full px-4 sm:pr-4">
            <div className="space-y-4">
              {urgentNeeds?.map((child) => {
                const needs = typeof child.needs === 'string' 
                  ? JSON.parse(child.needs) 
                  : child.needs;

                return (
                  <div key={child.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <p className="font-medium text-gray-900 mb-3">{child.name}</p>
                    <div className="flex flex-col gap-3">
                      {needs.map((need: Need, index: number) => (
                        <div 
                          key={`${need.category}-${index}`} 
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            need.is_urgent 
                              ? 'bg-red-50 border border-red-200' 
                              : 'bg-green-50 border border-green-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getNeedIcon(need.category)}
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                              </span>
                              <span className="text-sm text-gray-600">
                                {need.description}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant={need.is_urgent ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleToggleUrgent(child.id, need.category, needs)}
                            className="min-w-[140px]"
                          >
                            {need.is_urgent ? (
                              <>
                                <Minus className="h-4 w-4 mr-1" />
                                {language === 'fr' ? 'Retirer urgent' : 'Quitar urgente'}
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                {language === 'fr' ? 'Marquer urgent' : 'Marcar urgente'}
                              </>
                            )}
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