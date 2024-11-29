import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhotoUploadFieldProps {
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhotoUploadField = ({ handlePhotoChange }: PhotoUploadFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="photo">Photo</Label>
      <Input
        id="photo"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="cursor-pointer"
      />
      <p className="text-sm text-gray-500">
        Format accepté : JPG, PNG. Taille maximale : 5MB
      </p>
    </div>
  );
};