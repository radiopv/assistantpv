import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "lucide-react";

export const TestimonialCarousel = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["featured-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select(`
          *,
          sponsors (
            name,
            photo_url
          ),
          children (
            name
          )
        `)
        .eq("is_approved", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 space-y-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials?.map((testimonial) => (
        <Card key={testimonial.id} className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={testimonial.sponsors?.photo_url} />
              <AvatarFallback>
                {testimonial.sponsors?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {testimonial.sponsors?.name || "Parrain anonyme"}
              </p>
              <p className="text-sm text-gray-500">
                Parrain de {testimonial.children?.name}
              </p>
            </div>
          </div>
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 h-6 w-6 text-gray-200" />
            <p className="pl-6 italic text-gray-600">{testimonial.content}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};