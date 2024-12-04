import { Card } from "@/components/ui/card";
import { ProfilePhotoSection } from "./ProfilePhoto/ProfilePhotoSection";
import { ProfileFormFields } from "./ProfileFields/ProfileFormFields";
import { useLanguage } from "@/contexts/LanguageContext";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";

interface ProfileDetailsProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: string) => void;
  onPhotoUpdate: (url: string) => void;
}

const formatAge = (birthDate: string) => {
  const today = new Date();
  const birth = parseISO(birthDate);
  const years = differenceInYears(today, birth);
  
  if (years === 0) {
    const months = differenceInMonths(today, birth);
    return `${months} mois`;
  }
  
  return `${years} ans`;
};

export const ProfileDetails = ({ 
  child, 
  editing, 
  onChange,
  onPhotoUpdate 
}: ProfileDetailsProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-6">
      <div className="grid gap-6">
        <ProfilePhotoSection
          child={child}
          editing={editing}
          onPhotoUpdate={onPhotoUpdate}
        />
        
        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">{t("name")}</h3>
              <p className="mt-1">{child.name}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-gray-500">{t("birthDate")}</h3>
              <p className="mt-1">{child.birth_date}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-500">{t("age")}</h3>
              <p className="mt-1">{formatAge(child.birth_date)}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-500">{t("city")}</h3>
              <p className="mt-1">{child.city}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">{t("description")}</h3>
              <p className="mt-1 text-gray-700 whitespace-pre-wrap">{child.description || t("noDescription")}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-500">{t("story")}</h3>
              <p className="mt-1 text-gray-700 whitespace-pre-wrap">{child.story || t("noStory")}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-500">{t("comments")}</h3>
              <p className="mt-1 text-gray-700 whitespace-pre-wrap">{child.comments || t("noComments")}</p>
            </div>
          </div>
        </div>

        {editing && (
          <ProfileFormFields
            child={child}
            editing={editing}
            onChange={onChange}
          />
        )}
      </div>
    </Card>
  );
};