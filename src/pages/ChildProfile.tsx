import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { translateNeedCategory } from "@/utils/needsTranslation";
import { convertJsonToNeeds } from "@/types/needs";

export default function ChildProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: child, isLoading, error } = useQuery({
    queryKey: ['child', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (error) {
    return <ErrorAlert message="Erreur lors du chargement des informations de l'enfant" />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="aspect-video w-full max-w-3xl mx-auto">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const needs = convertJsonToNeeds(child.needs);

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      {/* Main content */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Photo section */}
        <div className="space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
            <img
              src={child.photo_url || "/placeholder.svg"}
              alt={child.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold font-title">{child.name}</h1>
            <p className="text-lg text-gray-600">
              {child.age} ans • {child.city}
            </p>
          </div>

          {child.description && (
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{child.description}</p>
            </div>
          )}

          {child.story && (
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-2">Histoire</h2>
              <p className="text-gray-600">{child.story}</p>
            </div>
          )}

          {needs && needs.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Besoins</h2>
              <div className="grid gap-3">
                {needs.map((need, index) => (
                  <div
                    key={`${need.category}-${index}`}
                    className={`p-4 rounded-lg ${
                      need.is_urgent
                        ? "bg-red-50 border border-red-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge
                          variant={need.is_urgent ? "destructive" : "secondary"}
                          className="mb-2"
                        >
                          {translateNeedCategory(need.category)}
                          {need.is_urgent && " (!)"} 
                        </Badge>
                        {need.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {need.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!child.is_sponsored && (
            <Button 
              size="lg" 
              className="w-full mt-6"
              onClick={() => navigate(`/become-sponsor?child=${child.id}`)}
            >
              Parrainer {child.name}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}