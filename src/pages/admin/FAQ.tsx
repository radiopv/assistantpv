import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
        .update({ is_active: !is_active })
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
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <Textarea
                placeholder="Réponse"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (newQuestion && newAnswer) {
                    addFaqMutation.mutate({
                      question: newQuestion,
                      answer: newAnswer,
                    });
                  }
                }}
              >
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqItems?.map((item) => (
          <AccordionItem 
            key={item.id} 
            value={item.id}
            className={`border p-4 rounded-lg ${!item.is_active ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-center">
              <AccordionTrigger className="text-left hover:no-underline">
                {editingFaq?.id === item.id ? (
                  <Input
                    value={editingFaq.question}
                    onChange={(e) =>
                      setEditingFaq({ ...editingFaq, question: e.target.value })
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  item.question
                )}
              </AccordionTrigger>
              <div className="flex gap-2">
                {editingFaq?.id === item.id ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      updateFaqMutation.mutate(editingFaq);
                    }}
                  >
                    Sauvegarder
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingFaq(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        toggleVisibilityMutation.mutate({
                          id: item.id,
                          is_active: item.is_active,
                        })
                      }
                    >
                      {item.is_active ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteFaqMutation.mutate(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <AccordionContent>
              {editingFaq?.id === item.id ? (
                <Textarea
                  value={editingFaq.answer}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, answer: e.target.value })
                  }
                />
              ) : (
                item.answer
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;