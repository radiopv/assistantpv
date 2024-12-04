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
import { Textarea } from "@/components/ui/textarea";
import { convertNeedsToJson } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "./FormFields/translations";

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

const ALLOWED_GENDERS = ['male', 'female'];

export const AddChildForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

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

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return t.nameRequired;
    if (!ALLOWED_GENDERS.includes(formData.gender)) return t.genderRequired;
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

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-lg font-semibold mb-4">
              {t.childInfo}
            </Label>
          </div>
          
          <BasicInfoFields 
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            translations={t}
          />
          
          <PhotoUploadField 
            handlePhotoChange={handlePhotoChange} 
            translations={t}
          />

          <div className="space-y-2">
            <Label htmlFor="description">{t.description}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t.descriptionPlaceholder}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story">{t.story}</Label>
            <Textarea
              id="story"
              name="story"
              value={formData.story}
              onChange={handleChange}
              placeholder={t.storyPlaceholder}
              className="min-h-[150px]"
            />
          </div>

          <NeedsSelectionField
            selectedNeeds={formData.needs}
            onNeedsChange={(needs) => setFormData(prev => ({ ...prev, needs }))}
            translations={t}
          />
        </div>

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
            {loading ? t.adding : t.add}
          </Button>
        </div>
      </form>
    </Card>
  );
};