import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AvailableChildrenGridProps {
  children: any[];
}

export const AvailableChildrenGrid = ({ children }: AvailableChildrenGridProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!children.length) {
    return <p>Aucun enfant disponible pour le moment.</p>;
  }

  const handleSponsorClick = async (childId: string) => {
    if (!user) {
      navigate(`/become-sponsor?child=${childId}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: childId,
          sponsor_id: user.id,
          status: 'pending',
          is_long_term: true,
          terms_accepted: true,
          email: user.email,
          full_name: user.name
        });

      if (error) throw error;

      toast.success("Votre demande de parrainage a été envoyée avec succès");
      navigate('/sponsor-dashboard');
    } catch (error) {
      console.error('Error creating sponsorship request:', error);
      toast.error("Une erreur est survenue lors de la demande de parrainage");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children.map((child) => (
        <Card key={child.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <img
              src={child.photo_url || "/placeholder.svg"}
              alt={child.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">{child.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>{child.age} ans</p>
              <p>{child.city}</p>
              <p>{child.gender === 'male' ? 'Garçon' : 'Fille'}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {child.needs?.map((need: any, index: number) => (
                <Badge 
                  key={`${need.category}-${index}`}
                  className={need.is_urgent ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  {need.category}
                  {need.is_urgent && " (!)"} 
                </Badge>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => handleSponsorClick(child.id)}
            >
              Parrainer
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};