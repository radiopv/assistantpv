import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PhotoUploadField } from "@/components/Children/FormFields/PhotoUploadField";

interface EditSponsorDialogProps {
  sponsor: any;
  open: boolean;
  onClose: () => void;
}

export const EditSponsorDialog = ({ sponsor, open, onClose }: EditSponsorDialogProps) => {
  const [formData, setFormData] = useState(sponsor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
    const filePath = `${sponsor.id}/${Math.random()}.${fileExt}`;

    try {
      if (formData.photo_url) {
        const oldPath = formData.photo_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('sponsor-photos')
            .remove([oldPath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('sponsor-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-photos')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        photo_url: publicUrl
      }));
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la photo",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sponsor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le parrain</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input
                id="facebook_url"
                value={formData.facebook_url || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                  <SelectItem value="sponsor">Parrain</SelectItem>
                  <SelectItem value="visitor">Visiteur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <PhotoUploadField handlePhotoChange={handlePhotoChange} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Actif</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_anonymous">Anonyme</Label>
              <Switch
                id="is_anonymous"
                checked={formData.is_anonymous}
                onCheckedChange={(checked) => handleSwitchChange('is_anonymous', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show_name_publicly">Afficher le nom publiquement</Label>
              <Switch
                id="show_name_publicly"
                checked={formData.show_name_publicly}
                onCheckedChange={(checked) => handleSwitchChange('show_name_publicly', checked)}
              />
            </div>
          </div>

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