import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const FAQAdmin = () => {
  const queryClient = useQueryClient();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });
      
      if (error) {
        toast({
          title: "Erreur lors du chargement des FAQs",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  const { mutate: updateFAQ } = useMutation({
    mutationFn: async ({ id, is_active }: { id: string, is_active: boolean }) => {
      const { error } = await supabase
        .from('faq')
        .update({ is_active })
        .eq('id', id);
      
      if (error) {
        toast({
          title: "Erreur lors de la mise à jour",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: is_active ? "FAQ activée" : "FAQ désactivée",
        description: "La modification a été enregistrée avec succès.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  const groupedFaqs = faqs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <Card className="p-6 space-y-8">
      <div className="space-y-8">
        {groupedFaqs && Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
          <div key={category} className="space-y-4">
            <h2 
              className="text-xl font-semibold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            >
              {category}
            </h2>
            <Accordion 
              type="single" 
              collapsible 
              className="w-full"
              value={expandedCategory === category ? "expanded" : ""}
            >
              {categoryFaqs?.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-200">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="hover:underline">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <div className="space-y-4">
                      <p className="whitespace-pre-wrap">{faq.answer}</p>
                      <div className="flex justify-end">
                        <Button
                          variant={faq.is_active ? "destructive" : "default"}
                          onClick={() => updateFAQ({ id: faq.id, is_active: !faq.is_active })}
                          className="min-w-[100px]"
                        >
                          {faq.is_active ? "Désactiver" : "Activer"}
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </Card>
  );
};