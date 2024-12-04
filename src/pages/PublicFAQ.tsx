import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PublicFAQ = () => {
  const { data: faqs, isLoading } = useQuery({
    queryKey: ['public-faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const groupedFaqs = faqs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="h-8 w-8 text-primary" />
          Questions Fréquentes
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Trouvez les réponses à vos questions sur le parrainage d'enfants et notre action à Cuba.
        </p>
      </div>

      <div className="grid gap-8">
        {groupedFaqs && Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
          <Card key={category} className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">{category}</h2>
            <Accordion type="single" collapsible className="w-full">
              {categoryFaqs?.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PublicFAQ;