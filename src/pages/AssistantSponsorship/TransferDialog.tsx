import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSponsor: any;
  onConfirm: () => void;
}

export const TransferDialog = ({
  open,
  onOpenChange,
  currentSponsor,
  onConfirm
}: TransferDialogProps) => {
  const { t } = useLanguage();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("transferTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("transferDescription").replace("{sponsor}", currentSponsor?.name || "")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t("confirmTransfer")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};