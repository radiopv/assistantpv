import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const FAQ = () => {
  const { t } = useLanguage();

  const { data: faqItems, isLoading } = useQuery({
    queryKey: ["faq-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t("faq")}</h1>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqItems?.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-lg font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 whitespace-pre-wrap">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;