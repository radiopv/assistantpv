import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  testimonial: any;
}

export const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <Card key={testimonial.id} className="p-6">
      <Quote className="h-8 w-8 text-primary mb-4" />
      <p className="text-gray-600 mb-4">{testimonial.content}</p>
      <div className="flex items-center">
        {testimonial.sponsors?.photo_url && (
          <img
            src={testimonial.sponsors.photo_url}
            alt={testimonial.sponsors.name}
            className="w-10 h-10 rounded-full mr-3"
          />
        )}
        <div>
          <p className="font-semibold">{testimonial.sponsors?.name}</p>
          <p className="text-sm text-gray-500">
            Parrain de {testimonial.children?.name}
          </p>
        </div>
      </div>
    </Card>
  );
};