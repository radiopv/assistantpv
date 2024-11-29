import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: faqItems, isLoading } = useQuery({
    queryKey: ["faq"],
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

  const categories = faqItems 
    ? [...new Set(faqItems.map(item => item.category))]
    : [];

  const filteredFAQ = selectedCategory
    ? faqItems?.filter(item => item.category === selectedCategory)
    : faqItems;

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">FAQ</h1>
        <p className="text-gray-600 mt-2">
          Questions fréquemment posées
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === null
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Tout
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <Accordion type="single" collapsible className="w-full">
        {filteredFAQ?.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;