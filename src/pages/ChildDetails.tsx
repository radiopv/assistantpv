import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { convertJsonToNeeds } from "@/types/needs";
import { ChildHeader } from "@/components/Children/Details/ChildHeader";
import { ChildBasicInfo } from "@/components/Children/Details/ChildBasicInfo";
import { ChildPhoto } from "@/components/Children/Details/ChildPhoto";
import { ChildDescription } from "@/components/Children/Details/ChildDescription";
import { ChildNeeds } from "@/components/Children/Details/ChildNeeds";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite">
      <div className="container mx-auto px-4 py-8">
        <ChildHeader name={child?.name || ''} />

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-cuba-coral/20">
              <div className="aspect-[4/3] relative">
                <img
                  src={child?.photo_url || "/placeholder.svg"}
                  alt={child?.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              {!child?.is_sponsored && (
                <div className="p-4 flex justify-center">
                  <Button 
                    onClick={handleSponsorClick}
                    size="lg"
                    className="w-full max-w-md bg-cuba-coral hover:bg-cuba-coral/90"
                  >
                    Parrainer cet enfant
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="md:col-span-5 space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-cuba-coral/20">
              <div className="space-y-4">
                <ChildBasicInfo 
                  birthDate={child?.birth_date || ''} 
                  city={child?.city} 
                />
                <ChildDescription 
                  description={child?.description} 
                  story={child?.story}
                />
              </div>
            </Card>

            <ChildNeeds needs={needs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;