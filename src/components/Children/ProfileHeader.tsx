import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileHeaderProps {
  name: string;
  editing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export const ProfileHeader = ({ 
  name, 
  editing, 
  onBack, 
  onEdit, 
  onSave, 
  onDelete 
}: ProfileHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("back")}
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {name}
        </h1>
      </div>
      <div className="flex gap-2">
        <Button 
          variant={editing ? "outline" : "default"}
          onClick={() => editing ? onSave() : onEdit()}
        >
          {editing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              {t("save")}
            </>
          ) : (
            t("edit")
          )}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              {t("delete")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteConfirmation")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteWarning")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {t("confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};