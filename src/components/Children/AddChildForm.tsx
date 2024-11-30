import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { differenceInYears, parseISO } from "date-fns";
import { BasicInfoFields } from "./FormFields/BasicInfoFields";
import { PhotoUploadField } from "./FormFields/PhotoUploadField";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

const translations = {
  fr: {
    title: "Informations de l'enfant",
    addChild: "Ajouter l'enfant",
    adding: "Ajout en cours...",
    cancel: "Annuler",
    success: "L'enfant a été ajouté avec succès.",
    error: "Une erreur est survenue lors de l'ajout de l'enfant",
    validation: {
      nameRequired: "Le nom est requis",
      genderRequired: "Le genre doit être 'male' ou 'female'",
      birthDateRequired: "La date de naissance est requise",
      birthDateInvalid: "La date de naissance est invalide",
      ageError: "Impossible de calculer l'âge"
    }
  },
  es: {
    title: "Información del niño",
    addChild: "Agregar niño",
    adding: "Agregando...",
    cancel: "Cancelar",
    success: "El niño ha sido agregado con éxito.",
    error: "Ocurrió un error al agregar al niño",
    validation: {
      nameRequired: "El nombre es requerido",
      genderRequired: "El género debe ser 'male' o 'female'",
      birthDateRequired: "La fecha de nacimiento es requerida",
      birthDateInvalid: "La fecha de nacimiento es inválida",
      ageError: "Imposible calcular la edad"
    }
  }
};

export const AddChildForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [language, setLanguage] = useState<"fr" | "es">("fr");
  const [formData, setFormData] = useState({
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
    if (!formData.name.trim()) return translations[language].validation.nameRequired;
    const ALLOWED_GENDERS = ['male', 'female'];
    if (!ALLOWED_GENDERS.includes(formData.gender)) return translations[language].validation.genderRequired;
    if (!formData.birth_date) return translations[language].validation.birthDateRequired;
    
    const age = calculateAge(formData.birth_date);
    if (age === null || age < 0) return translations[language].validation.birthDateInvalid;
    
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
        throw new Error(translations[language].validation.ageError);
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
          needs: []
        });

      if (error) throw error;

      toast({
        title: translations[language].addChild,
        description: translations[language].success,
      });

      navigate('/children');
    } catch (error: any) {
      console.error('Error adding child:', error);
      toast({
        variant: "destructive",
        title: translations[language].error,
        description: error.message || "Une erreur est survenue lors de l'ajout de l'enfant",
      });
    } finally {
      setLoading(false);
    }
  };

  const t = translations[language];

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold mb-4">
            {t.title}
          </Label>
          <Button 
            variant="ghost" 
            size="sm"
            type="button"
            onClick={() => setLanguage(language === "fr" ? "es" : "fr")}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {language.toUpperCase()}
          </Button>
        </div>
        
        <BasicInfoFields 
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
        />
        
        <PhotoUploadField handlePhotoChange={handlePhotoChange} />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/children')}
            className="w-full md:w-auto"
          >
            {t.cancel}
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? t.adding : t.addChild}
          </Button>
        </div>
      </form>
    </Card>
  );
};
