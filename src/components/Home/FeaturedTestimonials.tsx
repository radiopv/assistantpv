import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export const FeaturedTestimonials = () => {
  const { t } = useLanguage();
  
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['featured-testimonials'],
    queryFn: async () => {
      console.log("Récupération des témoignages...");
      const { data, error } = await supabase
        .from('temoignage')
        .select(`
          *,
          children:child_id (name),
          sponsors:sponsor_id (name, photo_url, is_anonymous)
        `)
        .eq('is_approved', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error("Erreur lors de la récupération des témoignages:", error);
        throw error;
      }
      
      console.log("Témoignages récupérés:", data);
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!testimonials?.length) {
    return <p className="text-gray-500 text-center italic">Aucun témoignage pour le moment</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="p-6 h-full flex flex-col bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-12 h-12">
                {testimonial.sponsors?.photo_url ? (
                  <img 
                    src={testimonial.sponsors.photo_url} 
                    alt="Photo de profil"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : null}
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {testimonial.sponsors?.is_anonymous ? "Parrain anonyme" : testimonial.sponsors?.name}
                </h4>
                {testimonial.children?.name && (
                  <p className="text-sm text-gray-600">
                    Parrain de {testimonial.children.name}
                  </p>
                )}
              </div>
              {testimonial.rating && (
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-cuba-gold text-cuba-gold" />
                  ))}
                </div>
              )}
            </div>
            
            <blockquote className="flex-1 text-gray-700 italic relative">
              <span className="text-5xl text-cuba-gold/20 absolute -top-4 -left-2">"</span>
              <p className="relative z-10 pl-4">
                {testimonial.content}
              </p>
            </blockquote>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <time className="text-xs text-gray-500">
                {format(new Date(testimonial.created_at), 'dd/MM/yyyy')}
              </time>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};