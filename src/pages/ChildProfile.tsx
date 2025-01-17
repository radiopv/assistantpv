import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ErrorAlert } from "@/components/ErrorAlert";
import { ChildProfileDetails } from "@/components/Children/ChildProfile/ChildProfileDetails";

export default function ChildProfile() {
  const { id } = useParams();

  const { data: child, isLoading, error, refetch } = useQuery({
    queryKey: ['child', id],
    queryFn: async () => {
      if (!id) throw new Error("ID de l'enfant manquant");
      
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Enfant non trouvé");
      
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorAlert 
          message={error instanceof Error ? error.message : "Une erreur est survenue"} 
          retry={refetch}
        />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="container mx-auto p-4">
        <ErrorAlert message="Enfant non trouvé" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ChildProfileDetails child={child} />
    </div>
  );
}