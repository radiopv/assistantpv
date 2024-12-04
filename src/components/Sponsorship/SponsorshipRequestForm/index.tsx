import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ChildSelectionField } from "./ChildSelectionField";
import { MotivationField } from "./MotivationField";
import { TermsField } from "./TermsField";
import { formSchema, type FormValues } from "./validation";

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
        <PersonalInfoFields form={form} />
        <ChildSelectionField form={form} />
        <MotivationField form={form} />
        <TermsField form={form} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Envoyer ma demande
        </Button>
      </form>
    </Form>
  );
};