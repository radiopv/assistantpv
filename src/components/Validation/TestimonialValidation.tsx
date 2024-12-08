import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const TestimonialValidation = () => {
  const { data: testimonials } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temoignage')
        .select('*')
        .is('is_approved', false);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div>
      <h2 className="text-lg font-semibold">Pending Testimonials</h2>
      <ul>
        {testimonials?.map((testimonial) => (
          <li key={testimonial.id} className="border-b py-2">
            <p>{testimonial.content}</p>
            <p className="text-sm text-gray-500">Author: {testimonial.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};