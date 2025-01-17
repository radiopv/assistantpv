import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Children } from "@/integrations/supabase/types/children";

interface AvailableChildrenGridProps {
  children: Children["Row"][];
  isLoading: boolean;
}

export const AvailableChildrenGrid = ({ children, isLoading }: AvailableChildrenGridProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!children.length) {
    return <div>{t("noChildrenAvailable")}</div>;
  }

  const handleSponsorClick = async (childId: string) => {
    if (!user) {
      // Si non connecté, rediriger vers le formulaire de parrainage
      navigate(`/become-sponsor?child=${childId}`);
      return;
    }

    try {
      // Vérifier si une demande existe déjà
      const { data: existingRequests, error: checkError } = await supabase
        .from('child_assignment_requests')
        .select('*')
        .eq('child_id', childId)
        .eq('sponsor_id', user.id)
        .eq('status', 'pending');

      if (checkError) throw checkError;

      if (existingRequests && existingRequests.length > 0) {
        toast.error(t("requestAlreadyExists"));
        return;
      }

      // Créer une nouvelle demande
      const { error: requestError } = await supabase
        .from('child_assignment_requests')
        .insert({
          sponsor_id: user.id,
          child_id: childId,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (requestError) throw requestError;

      // Mettre à jour le statut de l'enfant
      const { error: updateError } = await supabase
        .from('children')
        .update({ 
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', childId);

      if (updateError) throw updateError;

      toast.success(t("sponsorshipRequestCreated"));
    } catch (error) {
      console.error('Error creating sponsorship request:', error);
      toast.error(t("errorRequestingSponsorship"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => {
          // Convert needs to array if it's not already and check for urgent needs
          const needsArray = Array.isArray(child.needs) ? child.needs : [];
          const hasUrgentNeeds = needsArray.some((need: any) => need.is_urgent);
          
          return (
            <Card key={child.id} className="overflow-hidden">
              <div className="p-4">
                <h3 className="font-semibold">{child.name}</h3>
                <p>{child.city}</p>
                <p>{child.age} {t("years")}</p>
                {hasUrgentNeeds && <p className="text-red-500">{t("urgentNeeds")}</p>}
              </div>

              <Button 
                onClick={() => handleSponsorClick(child.id)}
                className={`w-full ${
                  hasUrgentNeeds
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                }`}
              >
                {t("sponsorThisChild")}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};