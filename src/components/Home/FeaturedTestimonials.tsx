import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export const FeaturedTestimonials = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['featured-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temoignage')
        .select(`
          *,
          children:child_id (name),
          sponsors:sponsor_id (name, is_anonymous)
        `)
        .eq('is_approved', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!testimonials?.length) {
    return <p className="text-gray-500">Aucun témoignage pour le moment</p>;
  }

  return (
    <div className="space-y-4">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="p-4">
          <blockquote className="text-gray-700">
            "{testimonial.content}"
          </blockquote>
          <footer className="mt-2 text-sm text-gray-500">
            <p>
              {testimonial.sponsors?.is_anonymous 
                ? "Parrain anonyme" 
                : testimonial.sponsors?.name
              }
              {testimonial.children?.name && ` - Parrain de ${testimonial.children.name}`}
            </p>
            <time className="text-xs">
              {format(new Date(testimonial.created_at), 'dd/MM/yyyy')}
            </time>
          </footer>
        </Card>
      ))}
    </div>
  );
};