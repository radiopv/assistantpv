import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const AssistantStats = () => {
  const { language } = useLanguage();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['assistant-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_type', 'assistant')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <span>{language === 'fr' ? 'Erreur de chargement' : 'Error de carga'}</span>
      </Alert>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        {language === 'fr' ? 'Activités Récentes des Assistants' : 'Actividades Recientes de Asistentes'}
      </h3>
      <div className="space-y-2">
        {stats?.map((log) => (
          <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">{log.description}</p>
            <p className="text-xs text-gray-400">
              {new Date(log.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};