import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChildCardProps {
  child: any;
  onViewProfile: (id: string) => void;
  onSponsorClick: (child: any) => void;
}

export const ChildCard = ({ child, onViewProfile, onSponsorClick }: ChildCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSponsorClick = async () => {
    if (!user) {
      navigate(`/become-sponsor?child=${child.id}`);
      return;
    }

    try {
      // Vérifier si l'enfant est déjà parrainé
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('is_sponsored, name')
        .eq('id', child.id)
        .maybeSingle();

      if (childError) {
        console.error('Erreur lors de la vérification du statut de l\'enfant:', childError);
        toast.error("Une erreur est survenue lors de la vérification du statut de l'enfant");
        return;
      }

      if (!childData) {
        toast.error("Impossible de trouver les informations de l'enfant");
        return;
      }

      if (childData.is_sponsored) {
        toast.error("Cet enfant est déjà parrainé");
        return;
      }

      // Vérifier si une demande existe déjà
      const { data: existingRequest, error: requestError } = await supabase
        .from('sponsorship_requests')
        .select('status')
        .eq('child_id', child.id)
        .eq('sponsor_id', user.id)
        .maybeSingle();

      if (requestError) {
        console.error('Erreur lors de la vérification des demandes existantes:', requestError);
        toast.error("Une erreur est survenue lors de la vérification des demandes existantes");
        return;
      }

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          toast.error("Vous avez déjà une demande de parrainage en cours pour cet enfant");
        } else {
          toast.error("Vous avez déjà parrainé cet enfant");
        }
        return;
      }

      // Créer la demande de parrainage
      const { error: createError } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: child.id,
          sponsor_id: user.id,
          status: 'pending',
          is_long_term: true,
          terms_accepted: true,
          full_name: user.name,
          email: user.email,
          city: user.city
        });

      if (createError) {
        console.error('Erreur lors de la création de la demande:', createError);
        toast.error("Une erreur est survenue lors de la demande de parrainage");
        return;
      }

      toast.success("Votre demande de parrainage a été envoyée avec succès");
      
    } catch (error) {
      console.error('Erreur lors de la demande de parrainage:', error);
      toast.error("Une erreur est survenue lors de la demande de parrainage");
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative pb-[75%]">
        {child.photo_url && (
          <img
            src={child.photo_url}
            alt={child.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {child.needs?.some((need: any) => need.is_urgent) && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 right-2"
          >
            BESOIN URGENT
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{child.name}</h3>
            <p className="text-sm text-gray-500">
              {child.age} ans {child.birth_date && "• "}{child.city}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="text-sm">
        <p className="line-clamp-2">{child.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleSponsorClick}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 text-lg shadow-md transition-all duration-200"
        >
          Parrainer cet enfant
        </Button>
      </CardFooter>
    </Card>
  );
};