import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface FAQItemProps {
  item: any;
  editingFaq: any;
  setEditingFaq: (faq: any) => void;
  onUpdate: (faq: any) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, is_active: boolean) => void;
}

export const FAQItem = ({
  item,
  editingFaq,
  setEditingFaq,
  onUpdate,
  onDelete,
  onToggleVisibility,
}: FAQItemProps) => {
  return (
    <AccordionItem
      value={item.id}
      className={`border p-4 rounded-lg ${!item.is_active ? "opacity-60" : ""}`}
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
            <Button size="sm" onClick={() => onUpdate(editingFaq)}>
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
                onClick={() => onToggleVisibility(item.id, item.is_active)}
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
                onClick={() => onDelete(item.id)}
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
  );
};