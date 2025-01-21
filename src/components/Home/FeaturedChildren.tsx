import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AvailableChildrenGrid } from "@/components/Children/AvailableChildrenGrid";
import { convertJsonToNeeds } from "@/types/needs";
import { handleError } from "@/utils/error-handler";
import { ErrorAlert } from "@/components/ErrorAlert";

export const FeaturedChildren = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAvailableChildren = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("is_sponsored", false)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      const childrenWithParsedNeeds = data.map(child => ({
        ...child,
        needs: convertJsonToNeeds(child.needs)
      }));

      setChildren(childrenWithParsedNeeds);
    } catch (error) {
      handleError(error, "Erreur lors du chargement des enfants");
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableChildren();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorAlert 
          message="Erreur lors du chargement des enfants" 
          retry={fetchAvailableChildren}
        />
      </div>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Enfants en attente de parrainage
        </h2>
        <AvailableChildrenGrid 
          children={children} 
          isLoading={loading}
        />
      </div>
    </section>
  );
};