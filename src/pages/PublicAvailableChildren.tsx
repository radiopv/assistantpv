import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, Heart } from "lucide-react";

const PublicAvailableChildren = () => {
  const navigate = useNavigate();
  
  const { data: children, isLoading } = useQuery({
    queryKey: ['available-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('is_sponsored', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Enfants en Attente de Parrainage</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez les enfants qui attendent votre soutien. Chaque parrainage change une vie.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children?.map((child) => (
          <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
              </div>
              <Button 
                className="w-full mt-4 gap-2" 
                onClick={() => navigate(`/become-sponsor?child=${child.id}`)}
              >
                <Heart className="h-4 w-4" />
                Parrainer {child.name}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PublicAvailableChildren;