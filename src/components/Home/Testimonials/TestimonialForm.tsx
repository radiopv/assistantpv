import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface TestimonialFormProps {
  sponsoredChildren: any[];
  selectedChild: string | null;
  setSelectedChild: (childId: string | null) => void;
  content: string;
  setContent: (content: string) => void;
  handleSubmitTestimonial: () => Promise<void>;
  isSubmitting: boolean;
}

export const TestimonialForm = ({
  sponsoredChildren,
  selectedChild,
  setSelectedChild,
  content,
  setContent,
  handleSubmitTestimonial,
  isSubmitting
}: TestimonialFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Choisir l'enfant
        </label>
        <select
          className="w-full p-2 border rounded"
          value={selectedChild || ""}
          onChange={(e) => setSelectedChild(e.target.value)}
        >
          <option value="">Sélectionner un enfant</option>
          {sponsoredChildren.map((sponsorship) => (
            <option
              key={sponsorship.child_id}
              value={sponsorship.child_id}
            >
              {sponsorship.children?.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Votre témoignage
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Partagez votre expérience..."
          className="min-h-[100px]"
        />
      </div>
      <Button
        onClick={handleSubmitTestimonial}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Envoyer
      </Button>
    </div>
  );
};