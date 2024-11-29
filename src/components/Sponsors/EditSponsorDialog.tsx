import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SponsorFormFields } from "./SponsorFormFields";
import { ErrorAlert } from "../ErrorAlert";

interface EditSponsorDialogProps {
  sponsor: any;
  open: boolean;
  onClose: () => void;
}

export const EditSponsorDialog = ({ sponsor, open, onClose }: EditSponsorDialogProps) => {
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (sponsor) {
      setFormData({
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
        show_name_publicly: sponsor.show_name_publicly || false
      });
    }
  }, [sponsor]);

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
      // Si une photo existe déjà, on la supprime
      if (formData.photo_url) {
        const oldPhotoPath = formData.photo_url.split('/').pop();
        if (oldPhotoPath) {
          await supabase.storage
            .from('sponsor-photos')
            .remove([`${sponsor.id}/${oldPhotoPath}`]);
        }
      }

      // Upload de la nouvelle photo
      const { error: uploadError, data } = await supabase.storage
        .from('sponsor-photos')
        .upload(`${sponsor.id}/${fileName}`, file);

      if (uploadError) throw uploadError;

      // Récupération de l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-photos')
        .getPublicUrl(`${sponsor.id}/${fileName}`);

      // Mise à jour du formData avec la nouvelle URL
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
        description: "Impossible de mettre à jour la photo. Veuillez réessayer.",
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
      onClose();
    } catch (error) {
      console.error('Error updating sponsor:', error);
      setError("Impossible de mettre à jour les informations");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sponsor || !formData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le parrain</DialogTitle>
        </DialogHeader>

        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <SponsorFormFields
            formData={formData}
            handleInputChange={handleInputChange}
            handleSwitchChange={handleSwitchChange}
            handleSelectChange={handleSelectChange}
            handlePhotoChange={handlePhotoChange}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};