import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Heart } from "lucide-react";
import { TestimonialCarousel } from "@/components/Testimonials/TestimonialCarousel";

interface Sponsor {
  name: string;
  photo_url: string | null;
  email?: string;
}

interface Child {
  id: string;
  name: string;
  age: number;
  city: string | null;
  gender: 'male' | 'female';
  photo_url: string | null;
  needs?: {
    category: string;
    is_urgent: boolean;
  }[];
  sponsor_name: string | null;
  sponsor_photo_url: string | null;
}

const PublicSponsoredChildren = () => {
  const { data: children, isLoading } = useQuery({
    queryKey: ['sponsored-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select(`
          id,
          name,
          age,
          city,
          gender,
          photo_url,
          needs,
          sponsor_name,
          sponsor_photo_url
        `)
        .eq('is_sponsored', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data?.map(child => ({
        ...child,
        gender: child.gender.toLowerCase() as 'male' | 'female',
        needs: Array.isArray(child.needs) ? child.needs : []
      })) as Child[];
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
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Enfants Parrainés</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez les belles histoires de parrainage et l'impact positif sur la vie de ces enfants.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Témoignages de Parrains</h2>
        <TestimonialCarousel />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Enfants Récemment Parrainés</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {children?.map((child) => (
            <Card key={child.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={child.photo_url || "/placeholder.svg"}
                  alt={child.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-3">
                    {child.sponsor_photo_url && (
                      <img
                        src={child.sponsor_photo_url}
                        alt={child.sponsor_name || 'Parrain'}
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    )}
                    <div className="text-white">
                      <p className="font-medium">{child.name}</p>
                      <p className="text-sm opacity-90">
                        Parrainé{child.gender === 'female' ? 'e' : ''} par {child.sponsor_name || 'Un parrain anonyme'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-rose-500">
                  <Heart className="h-5 w-5 fill-current" />
                  <span className="text-sm">Histoire de parrainage</span>
                </div>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>{child.age} ans</p>
                  <p>{child.city}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PublicSponsoredChildren;