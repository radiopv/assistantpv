import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhotoUploadProps {
  onPhotosChange: (files: FileList | null) => void;
}

export const PhotoUpload = ({ onPhotosChange }: PhotoUploadProps) => {
  return (
    <div>
      <Label htmlFor="photos">Photos</Label>
      <div className="mt-2">
        <Input
          id="photos"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onPhotosChange(e.target.files)}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};