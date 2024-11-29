import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface PhotoUploadProps {
  onPhotosChange: (files: FileList | null) => void;
}

export const PhotoUpload = ({ onPhotosChange }: PhotoUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
    onPhotosChange(files);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="photos">Photos</Label>
      <Input
        id="photos"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="cursor-pointer"
      />
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span>{selectedFiles.length} file(s) selected</span>
        </div>
      )}
    </div>
  );
};