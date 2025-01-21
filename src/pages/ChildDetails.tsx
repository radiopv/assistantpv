import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { convertJsonToNeeds } from "@/types/needs";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { ChildHeader } from "@/components/Children/Details/ChildHeader";
import { ChildDescription } from "@/components/Children/Details/ChildDescription";
import { ChildNeeds } from "@/components/Children/Details/ChildNeeds";
import { SponsorshipButton } from "@/components/Children/Details/SponsorshipButton";

const ChildDetails = () => {
  const { id } = useParams();

  const { data: child, isLoading, error } = useQuery({
    queryKey: ['child', id],
    queryFn: async () => {
      if (!id) throw new Error('No child ID provided');

      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const formatAge = (birthDate: string) => {
    const today = new Date();
    const birth = parseISO(birthDate);
    const years = differenceInYears(today, birth);
    const months = differenceInMonths(today, birth) % 12;

    if (years === 0) {
      return `${months} mois`;
    }
    
    if (months === 0) {
      return `${years} ans`;
    }

    return `${years} ans et ${months} mois`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold">Erreur lors du chargement</h2>
          <p className="text-gray-600">
            Une erreur est survenue lors du chargement des informations de l'enfant.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || !child) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex gap-6">
          <Skeleton className="h-64 w-64" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const needs = convertJsonToNeeds(child.needs);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <ChildHeader
        name={child.name}
        photoUrl={child.photo_url}
        birthDate={child.birth_date}
        formatAge={formatAge}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <ChildDescription
          description={child.description}
          story={child.story}
          city={child.city}
        />
        <ChildNeeds needs={needs} />
      </div>

      <div className="flex justify-center mt-8">
        <SponsorshipButton childId={id!} />
      </div>
    </div>
  );
};

export default ChildDetails;