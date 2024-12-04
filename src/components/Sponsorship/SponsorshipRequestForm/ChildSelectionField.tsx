import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./validation";

interface ChildSelectionFieldProps {
  form: UseFormReturn<FormValues>;
}

export const ChildSelectionField = ({ form }: ChildSelectionFieldProps) => {
  const { data: availableChildren, isLoading } = useQuery({
    queryKey: ['available-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, age, city')
        .eq('is_sponsored', false)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="childId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Enfant à parrainer</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un enfant (optionnel)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Chargement...
                </SelectItem>
              ) : (
                availableChildren?.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name} ({child.age} ans) - {child.city}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormDescription>
            Vous pouvez choisir un enfant spécifique ou nous laisser faire le choix
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};