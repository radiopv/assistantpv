import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AlbumMediaUploadProps {
  childId: string;
  onUploadComplete?: () => void;
}

export const AlbumMediaUpload = ({ childId, onUploadComplete }: AlbumMediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [position, setPosition] = useState<string>("main");
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${childId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('album-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('album-media')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('album_media')
        .insert({
          child_id: childId,
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          position: position,
          layout_position: position // Make sure to set both position and layout_position
        });

      if (dbError) throw dbError;

      toast({
        title: "Photo ajoutée",
        description: "La photo a été ajoutée avec succès à l'album.",
      });

      onUploadComplete?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'upload.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="position">Position de l'image</Label>
      <Select value={position} onValueChange={setPosition}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez une position" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="main">Principale</SelectItem>
          <SelectItem value="secondary">Secondaire</SelectItem>
          <SelectItem value="tertiary">Tertiaire</SelectItem>
        </SelectContent>
      </Select>

      <Label htmlFor="photo">Ajouter une photo</Label>
      <Input
        id="photo"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      <Button disabled={uploading}>
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Upload en cours..." : "Upload"}
      </Button>
    </div>
  );
};