import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface PhotoUploadProps {
  onPhotosChange: (files: FileList | null) => void;
}

export const PhotoUpload = ({ onPhotosChange }: PhotoUploadProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onPhotosChange(files);

    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    } else {
      setPreviewUrls([]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photos">Photos</Label>
        <Input
          id="photos"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>

      {previewUrls.length > 0 && (
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="aspect-square relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};