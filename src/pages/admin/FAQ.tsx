import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Accordion } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { FAQItem } from "@/components/Admin/FAQ/FAQItem";
import { AddFAQDialog } from "@/components/Admin/FAQ/AddFAQDialog";

const FAQ = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const { data: faqItems, isLoading } = useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    }
  });

  const addFaqMutation = useMutation({
    mutationFn: async (newFaq: { question: string; answer: string }) => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("faq")
        .insert([{ 
          question: newFaq.question, 
          answer: newFaq.answer,
          is_active: true,
          display_order: (faqItems?.length || 0) + 1,
          created_at: now,
          updated_at: now
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      toast({
        title: "Question ajoutée",
        description: "La question a été ajoutée avec succès",
      });
      setNewQuestion("");
      setNewAnswer("");
      setIsEditing(false);
    },
  });

  const updateFaqMutation = useMutation({
    mutationFn: async (faq: any) => {
      const { data, error } = await supabase
        .from("faq")
        .update({ 
          question: faq.question, 
          answer: faq.answer,
          is_active: faq.is_active,
          updated_at: new Date().toISOString()
        })
        .eq("id", faq.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      toast({
        title: "Question mise à jour",
        description: "La question a été mise à jour avec succès",
      });
      setEditingFaq(null);
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("faq")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      toast({
        title: "Question supprimée",
        description: "La question a été supprimée avec succès",
      });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("faq")
        .update({ 
          is_active: !is_active,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      toast({
        title: "Visibilité mise à jour",
        description: "La visibilité de la question a été mise à jour",
      });
    },
  });

  const handleAddFaq = () => {
    if (newQuestion && newAnswer) {
      addFaqMutation.mutate({
        question: newQuestion,
        answer: newAnswer,
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQ</h1>
          <p className="text-gray-600 mt-2">
            Gestion des questions fréquemment posées
          </p>
        </div>
        <AddFAQDialog
          isOpen={isEditing}
          onOpenChange={setIsEditing}
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          newAnswer={newAnswer}
          setNewAnswer={setNewAnswer}
          onAdd={handleAddFaq}
        />
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqItems?.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            editingFaq={editingFaq}
            setEditingFaq={setEditingFaq}
            onUpdate={updateFaqMutation.mutate}
            onDelete={deleteFaqMutation.mutate}
            onToggleVisibility={(id, isActive) =>
              toggleVisibilityMutation.mutate({ id, isActive })
            }
          />
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;