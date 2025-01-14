import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestimonialSectionProps {
  testimonials: any[];
}

export const TestimonialSection = ({ testimonials }: TestimonialSectionProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      noTestimonials: "Aucun témoignage",
      approved: "Approuvé",
      pending: "En attente d'approbation"
    },
    es: {
      noTestimonials: "No hay testimonios",
      approved: "Aprobado",
      pending: "Pendiente de aprobación"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <p className="text-center text-gray-500">{t.noTestimonials}</p>
        ) : (
          testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="text-gray-600">{testimonial.content}</p>
              <div className="mt-2 text-sm">
                {testimonial.is_approved ? (
                  <span className="text-green-600">{t.approved}</span>
                ) : (
                  <span className="text-yellow-600">{t.pending}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};