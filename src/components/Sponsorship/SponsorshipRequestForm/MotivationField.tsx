import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./validation";

interface MotivationFieldProps {
  form: UseFormReturn<FormValues>;
}

export const MotivationField = ({ form }: MotivationFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="motivation"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Votre motivation *</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="Expliquez-nous pourquoi vous souhaitez devenir parrain..."
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};