import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./validation";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const PersonalInfoFields = ({ form }: PersonalInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom complet *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone</FormLabel>
            <FormControl>
              <Input type="tel" {...field} />
            </FormControl>
            <FormDescription>
              Facultatif mais recommandé pour faciliter le suivi
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="facebookUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profil Facebook</FormLabel>
            <FormControl>
              <Input type="url" {...field} />
            </FormControl>
            <FormDescription>
              Facultatif - nous permet de mieux vous connaître
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};