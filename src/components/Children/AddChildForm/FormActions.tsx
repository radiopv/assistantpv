import { Button } from "@/components/ui/button";

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
  translations: any;
}

export const FormActions = ({ loading, onCancel, translations }: FormActionsProps) => {
  return (
    <div className="flex gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="w-full md:w-auto"
      >
        {translations.cancel}
      </Button>
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full md:w-auto"
      >
        {loading ? translations.adding : translations.add}
      </Button>
    </div>
  );
};