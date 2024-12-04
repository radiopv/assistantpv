import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { HomepageConfig } from "@/types/homepage";

export const ConfigSection = ({ config }: { config: HomepageConfig[] }) => {
  const queryClient = useQueryClient();

  const updateConfig = useMutation({
    mutationFn: async (updatedConfig: Partial<HomepageConfig>) => {
      const { error } = await supabase
        .from('homepage_config')
        .update(updatedConfig)
        .eq('id', updatedConfig.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-config'] });
      toast.success("Configuration mise à jour avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    }
  });

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Configuration des sections</h2>
      <div className="space-y-6">
        {config?.map((section) => (
          <div key={section.id} className="space-y-4 border-b pb-4">
            <h3 className="text-xl font-semibold capitalize">{section.section_name}</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <Input
                  value={section.title || ''}
                  onChange={(e) => updateConfig.mutate({
                    ...section,
                    title: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sous-titre</label>
                <Input
                  value={section.subtitle || ''}
                  onChange={(e) => updateConfig.mutate({
                    ...section,
                    subtitle: e.target.value
                  })}
                />
              </div>
              {section.description !== null && (
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={section.description || ''}
                    onChange={(e) => updateConfig.mutate({
                      ...section,
                      description: e.target.value
                    })}
                  />
                </div>
              )}
              {section.button_text !== null && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Texte du bouton</label>
                    <Input
                      value={section.button_text || ''}
                      onChange={(e) => updateConfig.mutate({
                        ...section,
                        button_text: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Lien du bouton</label>
                    <Input
                      value={section.button_link || ''}
                      onChange={(e) => updateConfig.mutate({
                        ...section,
                        button_link: e.target.value
                      })}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};