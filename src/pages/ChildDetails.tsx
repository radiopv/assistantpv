import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { convertJsonToNeeds } from "@/types/needs";
import { useAuth } from "@/components/Auth/AuthProvider";
import { ArrowLeft, Heart, MapPin, Calendar, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { translateNeedCategory } from "@/utils/needsTranslation";

const ChildDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: child, isLoading, error } = useQuery({
    queryKey: ["child", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const handleSponsorshipRequest = async () => {
    if (!user) {
      navigate(`/become-sponsor?child=${id}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: id,
          full_name: user.name,
          email: user.email,
          city: user.city,
          status: 'pending',
          sponsor_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande de parrainage est en cours d'examen",
      });
    } catch (error) {
      console.error('Erreur lors de la demande de parrainage:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la demande de parrainage",
      });
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Card className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">Erreur lors du chargement des détails de l'enfant</p>
        </Card>
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
  const urgentNeeds = needs.filter(need => need.is_urgent);
  const regularNeeds = needs.filter(need => !need.is_urgent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="text-cuba-coral hover:text-cuba-coral/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-title font-bold text-cuba-coral">{child?.name}</h1>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6">
            <Card className="overflow-hidden border-cuba-coral/20 shadow-lg transition-transform hover:scale-[1.01] duration-300">
              <div className="aspect-square relative">
                <img
                  src={child?.photo_url || "/placeholder.svg"}
                  alt={child?.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </Card>
            
            {!child?.is_sponsored && (
              <Button 
                onClick={handleSponsorshipRequest}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cuba-coral to-cuba-coral/90 
                         hover:from-cuba-coral/90 hover:to-cuba-coral text-white shadow-lg hover:shadow-xl 
                         transition-all duration-300 py-6 text-lg group"
                size="lg"
              >
                <Heart className="w-6 h-6 transition-transform group-hover:scale-110" />
                Parrainer {child?.name}
              </Button>
            )}
          </div>

          <div className="md:col-span-7 space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-cuba-coral/20">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-cuba-coral" />
                    <span>{child?.birth_date ? `${calculateAge(child.birth_date)} ans` : "Non renseigné"}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-cuba-coral" />
                    <span>{child?.city || "Non renseignée"}</span>
                  </div>
                </div>

                {urgentNeeds.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <h3 className="font-semibold text-red-700">Besoins urgents</h3>
                    </div>
                    <div className="space-y-3">
                      {urgentNeeds.map((need, index) => (
                        <div key={index} className="bg-white/50 p-4 rounded-md border border-red-100">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="destructive" className="mb-2">
                                {translateNeedCategory(need.category)}
                              </Badge>
                              {need.description && (
                                <p className="text-red-700 mt-2">{need.description}</p>
                              )}
                            </div>
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {child?.description && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-cuba-coral mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-white/50 p-4 rounded-lg">
                      {child.description}
                    </p>
                  </div>
                )}

                {child?.story && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-cuba-coral mb-3">Histoire</h3>
                    <p className="text-gray-700 leading-relaxed bg-white/50 p-4 rounded-lg italic">
                      {child.story}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {regularNeeds.length > 0 && (
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-cuba-coral/20">
                <h3 className="text-xl font-semibold mb-4 text-cuba-coral">Autres besoins</h3>
                <div className="grid gap-3">
                  {regularNeeds.map((need, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gray-50 border border-gray-200 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {translateNeedCategory(need.category)}
                          </Badge>
                          {need.description && (
                            <p className="text-sm mt-2 text-gray-600">
                              {need.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;