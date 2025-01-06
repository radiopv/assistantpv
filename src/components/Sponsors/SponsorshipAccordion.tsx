import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SponsorFormFields } from "./SponsorFormFields";
import { SponsorChildrenList } from "./SponsorChildrenList";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ErrorAlert } from "../ErrorAlert";
import { useQuery } from "@tanstack/react-query";

interface SponsorshipAccordionProps {
  sponsor: any;
  onUpdate: () => void;
}

export const SponsorshipAccordion = ({ sponsor, onUpdate }: SponsorshipAccordionProps) => {
  const [formData, setFormData] = useState({
    id: sponsor.id,
    name: sponsor.name || '',
    email: sponsor.email || '',
    phone: sponsor.phone || '',
    city: sponsor.city || '',
    address: sponsor.address || '',
    facebook_url: sponsor.facebook_url || '',
    is_active: sponsor.is_active || false,
    is_anonymous: sponsor.is_anonymous || false,
    role: sponsor.role || '',
    photo_url: sponsor.photo_url || '',
    show_name_publicly: sponsor.show_name_publicly || false,
    sponsorships: sponsor.sponsorships || []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch available children
  const { data: availableChildren } = useQuery({
    queryKey: ['available-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }));
  };

  const handleSwitchChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    try {
      if (formData.photo_url) {
        const oldPhotoPath = formData.photo_url.split('/').pop();
        if (oldPhotoPath) {
          await supabase.storage
            .from('sponsor-photos')
            .remove([`${sponsor.id}/${oldPhotoPath}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('sponsor-photos')
        .upload(`${sponsor.id}/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-photos')
        .getPublicUrl(`${sponsor.id}/${fileName}`);

      setFormData(prev => ({
        ...prev,
        photo_url: publicUrl
      }));

      toast({
        title: "Photo mise à jour",
        description: "La photo a été mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la photo",
      });
    }
  };

  const handleAddChild = async (childId: string) => {
    try {
      const { error } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id: sponsor.id,
          child_id: childId,
          start_date: new Date().toISOString(),
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'enfant a été ajouté au parrainage",
      });

      // Refresh sponsor data
      const { data: updatedSponsorships } = await supabase
        .from('sponsorships')
        .select(`
          *,
          children (
            id,
            name,
            age,
            city,
            photo_url
          )
        `)
        .eq('sponsor_id', sponsor.id);

      setFormData(prev => ({
        ...prev,
        sponsorships: updatedSponsorships
      }));

      onUpdate();
    } catch (error) {
      console.error('Error adding child:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'enfant",
      });
    }
  };

  const handleRemoveChild = async (sponsorshipId: string) => {
    try {
      const { error } = await supabase
        .from('sponsorships')
        .delete()
        .eq('id', sponsorshipId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'enfant a été retiré du parrainage",
      });

      setFormData(prev => ({
        ...prev,
        sponsorships: prev.sponsorships.filter((s: any) => s.id !== sponsorshipId)
      }));

      onUpdate();
    } catch (error) {
      console.error('Error removing child:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer l'enfant",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          facebook_url: formData.facebook_url,
          is_active: formData.is_active,
          is_anonymous: formData.is_anonymous,
          role: formData.role,
          photo_url: formData.photo_url,
          show_name_publicly: formData.show_name_publicly
        })
        .eq('id', sponsor.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les informations du parrain ont été mises à jour",
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating sponsor:', error);
      setError("Impossible de mettre à jour les informations");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="sponsor-info">
        <AccordionTrigger className="text-lg font-semibold">
          Informations du parrain
        </AccordionTrigger>
        <AccordionContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <ErrorAlert message={error} />}
            <SponsorFormFields
              formData={formData}
              handleInputChange={handleInputChange}
              handleSwitchChange={handleSwitchChange}
              handleSelectChange={handleSelectChange}
              handlePhotoChange={handlePhotoChange}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="sponsored-children">
        <AccordionTrigger className="text-lg font-semibold">
          Enfants parrainés
        </AccordionTrigger>
        <AccordionContent>
          <SponsorChildrenList
            sponsorships={formData.sponsorships}
            availableChildren={availableChildren || []}
            onAddChild={handleAddChild}
            onRemoveChild={handleRemoveChild}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};