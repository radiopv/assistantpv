import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PhotoUploadDialog as MediaPhotoUploadDialog } from "../Media/PhotoUploadDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoUploadDialogProps {
  open: boolean;
  onClose: () => void;
  donationId: string;
  onSuccess: () => void;
}

export const PhotoUploadDialog = ({ open, onClose, donationId, onSuccess }: PhotoUploadDialogProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      uploadPhotos: "Ajouter des photos"
    },
    es: {
      uploadPhotos: "Agregar fotos"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t.uploadPhotos}</DialogTitle>
        </DialogHeader>
        <MediaPhotoUploadDialog 
          donationId={donationId}
          onUploadComplete={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};