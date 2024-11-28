import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VideoUploadProps {
  donationId?: string;
  onUploadComplete?: () => void;
}

export const VideoUpload = ({ donationId, onUploadComplete }: VideoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${donationId}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('donation-videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('donation-videos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('donation_videos')
        .insert({
          donation_id: donationId,
          url: publicUrl,
          mime_type: file.type
        });

      if (dbError) throw dbError;

      toast({
        title: "Vidéo ajoutée",
        description: "La vidéo a été ajoutée avec succès.",
      });

      onUploadComplete?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="video">Ajouter une vidéo</Label>
      <Input
        id="video"
        type="file"
        accept="video/*"
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