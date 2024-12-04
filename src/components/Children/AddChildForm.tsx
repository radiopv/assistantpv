import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BasicInfoFields } from "./FormFields/BasicInfoFields";
import { PhotoUploadField } from "./FormFields/PhotoUploadField";
import { NeedsSelectionField } from "./FormFields/NeedsSelectionField";
import { StoryFields } from "./AddChildForm/StoryFields";
import { FormActions } from "./AddChildForm/FormActions";
import { useChildForm } from "./AddChildForm/useChildForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "./FormFields/translations";
import { useNavigate } from "react-router-dom";

export const AddChildForm = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  
  const {
    formData,
    loading,
    setFormData,
    handleChange,
    handlePhotoChange,
    handleSubmit
  } = useChildForm();

  return (
    <Card className="p-6">
      <form onSubmit={(e) => handleSubmit(e, t)} className="space-y-6">
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

          <StoryFields
            description={formData.description}
            story={formData.story}
            handleChange={handleChange}
            translations={t}
          />

          <NeedsSelectionField
            selectedNeeds={formData.needs}
            onNeedsChange={(needs) => setFormData(prev => ({ ...prev, needs }))}
            translations={t}
          />
        </div>

        <FormActions
          loading={loading}
          onCancel={() => navigate('/children')}
          translations={t}
        />
      </form>
    </Card>
  );
};