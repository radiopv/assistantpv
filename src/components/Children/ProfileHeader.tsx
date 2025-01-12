import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Edit, Trash } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileHeaderProps {
  name: string;
  editing: boolean;
  userRole?: string;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export const ProfileHeader = ({
  name,
  editing,
  userRole,
  onBack,
  onEdit,
  onSave,
  onDelete
}: ProfileHeaderProps) => {
  const { t } = useLanguage();
  const canDelete = userRole === 'admin' || userRole === 'assistant';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{name}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {editing ? (
          <Button onClick={onSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {t("save")}
          </Button>
        ) : (
          <Button onClick={onEdit} variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            {t("edit")}
          </Button>
        )}
        
        {canDelete && !editing && (
          <Button
            onClick={onDelete}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            {t("delete")}
          </Button>
        )}
      </div>
    </div>
  );
};