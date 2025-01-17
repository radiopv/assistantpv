import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { toast } from "sonner";
import { useAuth } from "@/components/Auth/AuthProvider";
import { convertJsonToNeeds } from "@/types/needs";
import { 
  Calendar, 
  MapPin, 
  Heart,
  AlertCircle
} from "lucide-react";

const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(id);
};

const ChildDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: child, isLoading, error, refetch } = useQuery({
    queryKey: ["child", id],
    queryFn: async () => {
      if (!id) throw new Error("Aucun ID d'enfant fourni");
      if (!isValidUUID(id)) throw new Error("L'ID fourni n'est pas un UUID valide");
      
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Enfant non trouvé");
      return data;
    },
    enabled: !!id && isValidUUID(id)
  });

  const handleSponsorClick = async () => {
    if (!user) {
      navigate(`/become-sponsor?child=${id}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('child_assignment_requests')
        .insert({
          child_id: id,
          sponsor_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Votre demande de parrainage a été envoyée avec succès");
    } catch (error) {
      console.error('Error submitting sponsorship request:', error);
      toast.error("Une erreur est survenue lors de l'envoi de votre demande");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorAlert 
          message={error instanceof Error ? error.message : "Erreur lors du chargement des détails de l'enfant"}
          retry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px]" />
          <div className="space-y-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-24" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  const needs = child?.needs ? convertJsonToNeeds(child.needs) : [];
  const hasUrgentNeeds = needs.some(need => need.is_urgent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Photo Section */}
          <div className="md:col-span-7 space-y-6">
            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-cuba-coral/20">
              <div className="aspect-[4/3] relative">
                <img
                  src={child?.photo_url || "/placeholder.svg"}
                  alt={child?.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {hasUrgentNeeds && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Besoins urgents
                    </div>
                  </div>
                )}
              </div>
              {!child?.is_sponsored && (
                <div className="p-4 flex justify-center">
                  <Button 
                    onClick={handleSponsorClick}
                    size="lg"
                    className="w-full max-w-md bg-cuba-coral hover:bg-cuba-coral/90 text-white font-semibold"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Parrainer cet enfant
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Info Section */}
          <div className="md:col-span-5 space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-cuba-coral/20">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{child?.name}</h1>
                  <div className="mt-4 space-y-3">
                    {child?.birth_date && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>{new Date(child.birth_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    {child?.city && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{child.city}</span>
                      </div>
                    )}
                  </div>
                </div>

                {child?.description && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p className="text-gray-600">{child.description}</p>
                  </div>
                )}

                {child?.story && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Histoire</h2>
                    <p className="text-gray-600">{child.story}</p>
                  </div>
                )}

                {needs.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Besoins</h2>
                    <div className="space-y-3">
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
                            <span className={`font-medium ${need.is_urgent ? "text-red-600" : "text-gray-900"}`}>
                              {need.category}
                            </span>
                            {need.is_urgent && (
                              <span className="text-red-500 text-sm">Urgent</span>
                            )}
                          </div>
                          {need.description && (
                            <p className={`mt-1 text-sm ${need.is_urgent ? "text-red-600" : "text-gray-600"}`}>
                              {need.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;