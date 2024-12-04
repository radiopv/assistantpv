import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { differenceInYears, parseISO } from "date-fns";
import { BasicInfoFields } from "./FormFields/BasicInfoFields";
import { PhotoUploadField } from "./FormFields/PhotoUploadField";
import { NeedsSelectionField } from "./FormFields/NeedsSelectionField";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Need } from "@/types/needs";

interface FormData {
  name: string;
  gender: string;
  birth_date: string;
  city: string | null;
  status: string;
  needs: Need[];
  is_sponsored: boolean;
}

const ALLOWED_GENDERS = ['male', 'female'];

export const AddChildForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "",
    birth_date: "",
    city: null,
    status: "available",
    needs: [],
    is_sponsored: false
  });

  const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    return differenceInYears(new Date(), parseISO(birthDate));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "Le nom est requis";
    if (!ALLOWED_GENDERS.includes(formData.gender)) return "Le genre doit être 'male' ou 'female'";
    if (!formData.birth_date) return "La date de naissance est requise";
    
    const age = calculateAge(formData.birth_date);
    if (age === null || age < 0) return "La date de naissance est invalide";
    
    return null;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      const age = calculateAge(formData.birth_date);
      if (age === null) {
        throw new Error("Impossible de calculer l'âge");
      }

      let photoUrl = null;

      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('children-photos')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('children-photos')
            .getPublicUrl(data.path);

          photoUrl = publicUrl;
        }
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
          needs: formData.needs
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
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold mb-4">
              Informations de l'enfant
            </Label>
          </div>
          
          <BasicInfoFields 
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
          />
          
          <PhotoUploadField handlePhotoChange={handlePhotoChange} />

          <NeedsSelectionField
            selectedNeeds={formData.needs}
            onNeedsChange={(needs) => setFormData(prev => ({ ...prev, needs }))}
          />
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
    </Card>
  );
};