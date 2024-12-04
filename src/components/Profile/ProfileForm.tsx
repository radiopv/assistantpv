import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PhotoUploadField } from "@/components/Children/FormFields/PhotoUploadField";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/components/Children/FormFields/translations";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    city: string;
    photo_url: string;
  };
  userId: string;
  onClose: () => void;
}

export const ProfileForm = ({ initialData, userId, onClose }: ProfileFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [isUploading, setIsUploading] = useState(false);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setIsUploading(true);

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('sponsor-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-photos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
      toast({
        title: "Photo téléchargée",
        description: "Votre photo a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement de la photo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          photo_url: formData.photo_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
      });
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <PhotoUploadField 
          handlePhotoChange={handlePhotoChange} 
          translations={t}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="city">Ville</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={handleInputChange}
        />
      </div>
      <Button 
        onClick={handleUpdateProfile}
        disabled={isUploading}
      >
        {isUploading ? "Téléchargement..." : "Mettre à jour"}
      </Button>
    </div>
  );
};