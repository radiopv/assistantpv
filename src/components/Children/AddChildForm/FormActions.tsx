import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface FormActionsProps {
  loading: boolean;
  translations: {
    addChild: string;
  };
  onCancel?: () => void;
}

export const FormActions = ({ loading, translations, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement...
          </>
        ) : (
          translations.addChild
        )}
      </Button>
    </div>
  );
};