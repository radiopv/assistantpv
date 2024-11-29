import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface DonationSubmitButtonProps {
  loading: boolean;
  disabled: boolean;
}

export const DonationSubmitButton = ({ loading, disabled }: DonationSubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      disabled={disabled || loading}
      className="w-full"
    >
      {loading ? (
        <>
          <Upload className="mr-2 h-4 w-4 animate-spin" />
          Enregistrement...
        </>
      ) : (
        "Enregistrer le don"
      )}
    </Button>
  );
};