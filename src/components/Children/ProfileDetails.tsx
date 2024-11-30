import { Card } from "@/components/ui/card";
import { ProfilePhotoSection } from "./ProfilePhoto/ProfilePhotoSection";
import { ProfileFormFields } from "./ProfileFields/ProfileFormFields";
import { useTranslations } from "@/hooks/useTranslations";

interface ProfileDetailsProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: string) => void;
  onPhotoUpdate: (url: string) => void;
}

export const ProfileDetails = ({ 
  child, 
  editing, 
  onChange,
  onPhotoUpdate 
}: ProfileDetailsProps) => {
  const { t } = useTranslations();

  return (
    <Card className="p-6">
      <div className="grid gap-6">
        <ProfilePhotoSection
          child={child}
          editing={editing}
          onPhotoUpdate={onPhotoUpdate}
        />
        
        <ProfileFormFields
          child={child}
          editing={editing}
          onChange={onChange}
        />
      </div>
    </Card>
  );
};