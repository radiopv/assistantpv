import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { differenceInYears, parseISO } from "date-fns";
import { Need } from "@/types/needs";
import { convertNeedsToJson } from "@/types/needs";

interface FormData {
  name: string;
  gender: string;
  birth_date: string;
  city: string | null;
  status: string;
  needs: Need[];
  is_sponsored: boolean;
  description: string;
  story: string;
}

export const useChildForm = () => {
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
    is_sponsored: false,
    description: "",
    story: ""
  });

  const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    return differenceInYears(new Date(), parseISO(birthDate));
  };

  const validateForm = (t: any): string | null => {
    if (!formData.name.trim()) return t.nameRequired;
    if (!["male", "female"].includes(formData.gender)) return t.genderRequired;
    if (!formData.birth_date) return t.birthDateRequired;
    
    const age = calculateAge(formData.birth_date);
    if (age === null || age < 0) return t.birthDateInvalid;
    
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent, t: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationError = validateForm(t);
      if (validationError) {
        throw new Error(validationError);
      }

      const age = calculateAge(formData.birth_date);
      if (age === null) {
        throw new Error(t.birthDateInvalid);
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
          needs: convertNeedsToJson(formData.needs),
          description: formData.description,
          story: formData.story
        });

      if (error) throw error;

      toast({
        title: t.success,
        description: t.successMessage,
      });

      navigate('/children');
    } catch (error: any) {
      console.error('Error adding child:', error);
      toast({
        variant: "destructive",
        title: t.error,
        description: error.message || t.errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    setFormData,
    handleChange,
    handlePhotoChange,
    handleSubmit
  };
};