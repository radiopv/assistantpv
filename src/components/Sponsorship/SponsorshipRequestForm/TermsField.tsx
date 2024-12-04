import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./validation";

interface TermsFieldProps {
  form: UseFormReturn<FormValues>;
}

export const TermsField = ({ form }: TermsFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="termsAccepted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              J'accepte les conditions générales et la politique de confidentialité *
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};