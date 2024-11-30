import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const PublicTestimonials = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select(`
          *,
          sponsors (name, photo_url),
          children (name)
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="grid gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900">Témoignages</h1>
      <p className="text-gray-600 mt-2">
        Découvrez les témoignages de nos parrains et marraines.
      </p>

      <div className="grid gap-6 mt-8">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id} className="p-6">
            <div className="flex items-start gap-4">
              {testimonial.sponsors?.photo_url && (
                <img
                  src={testimonial.sponsors.photo_url}
                  alt={testimonial.sponsors.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">
                  {testimonial.sponsors?.name || "Parrain anonyme"}
                </p>
                <p className="text-sm text-gray-500">
                  Parrain/Marraine de {testimonial.children?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(testimonial.created_at), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
            </div>
            <p className="mt-4">{testimonial.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PublicTestimonials;