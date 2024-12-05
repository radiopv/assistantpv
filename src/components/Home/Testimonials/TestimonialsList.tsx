import { TestimonialCard } from "./TestimonialCard";

interface TestimonialsListProps {
  testimonials: any[];
}

export const TestimonialsList = ({ testimonials }: TestimonialsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {testimonials?.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
};