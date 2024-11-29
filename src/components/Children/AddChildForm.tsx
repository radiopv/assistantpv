import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { differenceInYears, parseISO } from "date-fns";
import { BasicInfoFields } from "./FormFields/BasicInfoFields";
import { PhotoUploadField } from "./FormFields/PhotoUploadField";

export const AddChildForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birth_date: "",
    city: "",
    status: "available",
  });

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    return differenceInYears(new Date(), parseISO(birthDate));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const decodeError = (error: any): string => {
    if (error.message.includes("children_gender_check")) {
      return "Le genre doit être 'M' ou 'F'";
    }
    if (error.message.includes("violates foreign key constraint")) {
      return "Erreur de référence : une des valeurs n'existe pas dans la base de données";
    }
    if (error.message.includes("violates not-null constraint")) {
      return "Tous les champs obligatoires doivent être remplis";
    }
    return error.message || "Une erreur inconnue est survenue";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = null;

      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('children-photos')
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('children-photos')
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      }

      // Validation explicite du genre
      if (!formData.gender || !['M', 'F'].includes(formData.gender)) {
        throw new Error("Le genre doit être 'M' ou 'F'");
      }

      const age = calculateAge(formData.birth_date);
      if (age === null) {
        throw new Error("La date de naissance est invalide");
      }

      const { error } = await supabase
        .from('children')
        .insert({
          name: formData.name,
          gender: formData.gender,
          birth_date: formData.birth_date,
          age: age,
          city: formData.city,
          status: "available",
          photo_url: photoUrl,
          is_sponsored: false,
        });

      if (error) throw error;

      toast({
        title: "Enfant ajouté",
        description: "L'enfant a été ajouté avec succès.",
      });

      navigate('/children');
    } catch (error: any) {
      console.error('Error adding child:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: decodeError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <BasicInfoFields 
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />
        <PhotoUploadField handlePhotoChange={handlePhotoChange} />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/children')}
          className="w-full md:w-auto"
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Ajout en cours..." : "Ajouter l'enfant"}
        </Button>
      </div>
    </form>
  );
};