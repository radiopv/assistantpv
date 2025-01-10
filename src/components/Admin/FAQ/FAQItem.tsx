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
      className={`border p-4 rounded-lg transition-all duration-300 hover:shadow-md 
        ${!item.is_active ? "opacity-60" : ""}
        bg-white/80 backdrop-blur-sm hover:bg-cuba-warmBeige/20`}
    >
      <div className="flex justify-between items-center">
        <AccordionTrigger className="text-left hover:no-underline font-title">
          {editingFaq?.id === item.id ? (
            <Input
              value={editingFaq.question}
              onChange={(e) =>
                setEditingFaq({ ...editingFaq, question: e.target.value })
              }
              onClick={(e) => e.stopPropagation()}
              className="bg-cuba-offwhite/50"
            />
          ) : (
            <span className="text-lg font-medium">{item.question}</span>
          )}
        </AccordionTrigger>
        <div className="flex gap-2">
          {editingFaq?.id === item.id ? (
            <Button 
              size="sm" 
              onClick={() => onUpdate(editingFaq)}
              className="bg-cuba-turquoise hover:bg-cuba-turquoise/80"
            >
              Sauvegarder
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingFaq(item)}
                className="hover:bg-cuba-warmBeige/20"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleVisibility(item.id, item.is_active)}
                className="hover:bg-cuba-warmBeige/20"
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
                className="hover:bg-cuba-warmBeige/20 hover:text-cuba-red"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <AccordionContent className="mt-2 text-gray-600">
        {editingFaq?.id === item.id ? (
          <Textarea
            value={editingFaq.answer}
            onChange={(e) =>
              setEditingFaq({ ...editingFaq, answer: e.target.value })
            }
            className="bg-cuba-offwhite/50"
          />
        ) : (
          <div className="prose max-w-none">
            {item.answer}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};