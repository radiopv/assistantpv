import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

export const FeaturedTestimonials = () => {
  const { t } = useLanguage();
  
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['featured-testimonials'],
    queryFn: async () => {
      console.log("Fetching testimonials...");
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

      if (error) {
        console.error("Error fetching testimonials:", error);
        throw error;
      }
      
      console.log("Testimonials fetched:", data);
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
    return <p className="text-gray-500">{t('noTestimonials')}</p>;
  }

  return (
    <div className="space-y-4">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="p-4 hover:shadow-lg transition-shadow duration-300">
          <blockquote className="text-gray-700 italic">
            "{testimonial.content}"
          </blockquote>
          <footer className="mt-2 text-sm text-gray-500">
            <p>
              {testimonial.sponsors?.is_anonymous ? t('anonymousSponsor') : testimonial.sponsors?.name}
              {testimonial.children?.name && ` - ${t('sponsorOf')} ${testimonial.children.name}`}
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