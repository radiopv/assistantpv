import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhotoUploadFieldProps {
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhotoUploadField = ({ handlePhotoChange }: PhotoUploadFieldProps) => {
  return (
    <div>
      <Label htmlFor="photo">Photo</Label>
      <Input
        id="photo"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="cursor-pointer"
      />
    </div>
  );
};