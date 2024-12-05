import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Need } from "@/types/needs";

export const CurrentNeedsList = () => {
  const { t } = useLanguage();

  const { data: childrenWithNeeds, isLoading } = useQuery({
    queryKey: ['children-needs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, needs')
        .not('needs', 'is', null);
      
      if (error) throw error;
      return data;
    }
  });

  const handleDeleteNeed = async (childId: string, needIndex: number) => {
    const child = childrenWithNeeds?.find(c => c.id === childId);
    if (!child) return;

    const needs = typeof child.needs === 'string' ? JSON.parse(child.needs) : child.needs;
    const updatedNeeds = needs.filter((_: any, index: number) => index !== needIndex);

    const { error } = await supabase
      .from('children')
      .update({ needs: updatedNeeds })
      .eq('id', childId);

    if (error) {
      toast.error(t('error'));
    } else {
      toast.success(t('success'));
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-48 bg-gray-100 rounded-lg" />;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('currentNeeds')}</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-6">
          {childrenWithNeeds?.map((child) => {
            const needs = typeof child.needs === 'string' ? JSON.parse(child.needs) : child.needs;
            return (
              <div key={child.id} className="space-y-2">
                <h4 className="font-medium text-gray-900">{child.name}</h4>
                <div className="space-y-2">
                  {needs.map((need: Need, index: number) => (
                    <div 
                      key={`${need.category}-${index}`}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        need.is_urgent ? 'bg-red-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant={need.is_urgent ? "destructive" : "secondary"}>
                          {need.category}
                        </Badge>
                        {need.is_urgent && (
                          <Badge variant="outline" className="text-red-500 border-red-500">
                            {t('urgent')}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNeed(child.id, index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};