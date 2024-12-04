import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhotoUploadFieldProps {
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  translations: any;
}

export const PhotoUploadField = ({ handlePhotoChange, translations }: PhotoUploadFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="photo">{translations.photo}</Label>
      <Input
        id="photo"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="cursor-pointer"
      />
      <p className="text-sm text-gray-500">
        {translations.acceptedFormats}
      </p>
    </div>
  );
};