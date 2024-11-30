import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInYears, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PublicChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: child, isLoading } = useQuery({
    queryKey: ['public-child', id],
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

  const handleSponsorshipRequest = () => {
    navigate(`/devenir-parrain?child=${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card className="p-6">
          <div className="grid gap-6">
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6">
          <p className="text-center text-gray-600">
            Enfant non trouvé
          </p>
        </Card>
      </div>
    );
  }

  const age = differenceInYears(new Date(), parseISO(child.birth_date));

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">{child.name}</h1>
      
      <Card className="overflow-hidden">
        <div className="aspect-video relative">
          <img
            src={child.photo_url || "/placeholder.svg"}
            alt={child.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold">Âge</h3>
              <p>{age} ans</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Ville</h3>
              <p>{child.city}</p>
            </div>

            {child.needs && child.needs.length > 0 && (
              <div>
                <h3 className="font-semibold">Besoins</h3>
                <ul className="list-disc list-inside space-y-2">
                  {child.needs.map((need: any, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>{need.category}</span>
                      {need.is_urgent && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Urgent
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button 
            className="w-full" 
            onClick={handleSponsorshipRequest}
          >
            Devenir parrain
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PublicChildProfile;