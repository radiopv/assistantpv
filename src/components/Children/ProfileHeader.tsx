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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Button variant="ghost" onClick={onBack} className="p-2 h-auto">
          <ArrowLeft className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">{t("back")}</span>
        </Button>
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
          {name}
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button 
          variant={editing ? "outline" : "default"}
          onClick={() => editing ? onSave() : onEdit()}
          className="w-full sm:w-auto"
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
            <Button variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="w-4 h-4 mr-2" />
              {t("delete")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[95%] sm:w-full max-w-md mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteConfirmation")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteWarning")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto mt-2 sm:mt-0">
                {t("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={onDelete} 
                className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};