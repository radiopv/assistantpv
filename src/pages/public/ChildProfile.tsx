import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInYears, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { convertJsonToNeeds } from "@/types/needs";

const PublicChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<any>(null);

  useEffect(() => {
    loadChild();
  }, [id]);

  const loadChild = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setChild(data);
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
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
          <p className="text-center text-gray-600">Enfant non trouvé</p>
        </Card>
      </div>
    );
  }

  const age = differenceInYears(new Date(), parseISO(child.birth_date));
  const needs = convertJsonToNeeds(child.needs);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/enfants-disponibles')}>
        ← Retour aux enfants disponibles
      </Button>

      <Card className="overflow-hidden">
        <div className="aspect-video relative">
          <img
            src={child.photo_url || "/placeholder.svg"}
            alt={child.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{child.name}</h1>
              <p className="text-gray-600">{age} ans</p>
              <p>{child.city}</p>
            </div>

            {needs.length > 0 && (
              <div>
                <h3 className="font-semibold">Besoins</h3>
                <ul className="list-disc list-inside space-y-2">
                  {needs.map((need, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>{need.category}</span>
                      {need.is_urgent && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Urgent
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4">
              <Button 
                className="w-full"
                onClick={() => navigate(`/devenir-parrain?child=${child.id}`)}
              >
                Parrainer cet enfant
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PublicChildProfile;