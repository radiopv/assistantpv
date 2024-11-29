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
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push("Le nom est requis");
    if (!formData.gender) errors.push("Le genre est requis");
    if (!["M", "F"].includes(formData.gender)) {
      errors.push("Le genre doit être 'M' ou 'F'");
    }
    if (!formData.birth_date) errors.push("La date de naissance est requise");
    if (!formData.city.trim()) errors.push("La ville est requise");
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: validationErrors.join(", "),
      });
      return;
    }

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

      const age = calculateAge(formData.birth_date);
      if (age === null) {
        throw new Error("La date de naissance est invalide");
      }

      const { error } = await supabase
        .from('children')
        .insert({
          name: formData.name.trim(),
          gender: formData.gender.toUpperCase(),
          birth_date: formData.birth_date,
          age: age,
          city: formData.city.trim(),
          status: "available",
          photo_url: photoUrl,
          is_sponsored: false,
          needs: []
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
        description: error.message || "Une erreur est survenue lors de l'ajout de l'enfant",
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