import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  facebookUrl: z.string().url("URL Facebook invalide").optional().or(z.literal("")),
  motivation: z.string().min(50, "La motivation doit contenir au moins 50 caractères"),
  childId: z.string().uuid().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, "Vous devez accepter les conditions"),
});

type FormValues = z.infer<typeof formSchema>;

export const SponsorshipRequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      facebookUrl: "",
      motivation: "",
      childId: undefined,
      termsAccepted: false,
    },
  });

  const { data: availableChildren, isLoading: childrenLoading } = useQuery({
    queryKey: ["available-children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("id, name, age, city")
        .eq("is_sponsored", false)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("sponsorship_requests").insert({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        facebook_url: values.facebookUrl,
        motivation: values.motivation,
        child_id: values.childId,
        terms_accepted: values.termsAccepted,
      });

      if (error) throw error;

      toast({
        title: "Demande envoyée avec succès",
        description: "Nous examinerons votre demande dans les plus brefs délais.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  {childrenLoading ? (
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Envoyer ma demande
        </Button>
      </form>
    </Form>
  );
};