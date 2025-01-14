import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface AlbumMediaUploadProps {
  childId: string;
  onUploadComplete?: () => void;
}

export const AlbumMediaUpload = ({ childId, onUploadComplete }: AlbumMediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    fr: {
      addPhoto: "Ajouter une photo",
      uploading: "Upload en cours...",
      upload: "Upload",
      success: "Photo ajoutée avec succès",
      error: "Une erreur est survenue lors de l'upload",
    },
    es: {
      addPhoto: "Agregar una foto",
      uploading: "Subiendo...",
      upload: "Subir",
      success: "Foto agregada con éxito",
      error: "Ocurrió un error durante la subida",
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);
      console.log("Starting upload process for child:", childId);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${childId}/${Math.random()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('album-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('album-media')
        .getPublicUrl(filePath);

      console.log("File uploaded successfully, getting child info...");

      // Get child info and active sponsorship
      const { data: child, error: childError } = await supabase
        .from('children')
        .select(`
          id,
          name,
          sponsorships (
            sponsor_id,
            status
          )
        `)
        .eq('id', childId)
        .single();

      if (childError) {
        console.error("Error fetching child:", childError);
        throw childError;
      }

      if (!child) {
        console.error("Child not found");
        throw new Error("Child not found");
      }

      console.log("Child data retrieved:", child);

      // Create album media entry
      const { error: dbError } = await supabase
        .from('album_media')
        .insert({
          child_id: childId,
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          is_approved: true
        });

      if (dbError) {
        console.error("Error creating album media:", dbError);
        throw dbError;
      }

      // Create audit log entry
      const { error: auditError } = await supabase
        .from('children_audit_logs')
        .insert({
          child_id: childId,
          action: 'media_added',
          changes: {
            url: publicUrl,
            file_name: file.name,
            file_type: file.type
          }
        });

      if (auditError) {
        console.error("Error creating audit log:", auditError);
      }

      // Find active sponsorship and create notification
      const activeSponsorship = child.sponsorships?.find(s => s.status === 'active');
      
      console.log("Active sponsorship found:", activeSponsorship);

      if (activeSponsorship?.sponsor_id) {
        console.log("Creating notification for sponsor:", activeSponsorship.sponsor_id);
        
        const notificationData = {
          recipient_id: activeSponsorship.sponsor_id,
          type: 'photo_upload',
          title: language === 'fr' ? 
            'Nouvelle photo ajoutée' : 
            'Nueva foto agregada',
          content: language === 'fr' ? 
            `Une nouvelle photo a été ajoutée à l'album de ${child.name}. Cliquez pour voir l'album.` :
            `Se ha agregado una nueva foto al álbum de ${child.name}. Haga clic para ver el álbum.`,
          link: `/children/${childId}/album`,
          metadata: {
            child_id: childId,
            child_name: child.name,
            photo_url: publicUrl
          }
        };

        console.log("Sending notification with data:", notificationData);

        const { error: notifError } = await supabase
          .from('notifications')
          .insert(notificationData);

        if (notifError) {
          console.error("Error creating notification:", notifError);
          throw notifError;
        }

        console.log("Notification created successfully");
      } else {
        console.log("No active sponsorship found for child");
      }

      toast({
        title: t.success,
        description: t.success,
      });

      onUploadComplete?.();
    } catch (error: any) {
      console.error("Complete upload error:", error);
      toast({
        variant: "destructive",
        title: t.error,
        description: t.error,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="photo">{t.addPhoto}</Label>
      <div className="flex items-center gap-4">
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <Button 
          onClick={() => document.getElementById('photo')?.click()}
          disabled={uploading}
          variant="outline"
          className="w-full"
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          {uploading ? t.uploading : t.upload}
        </Button>
      </div>
    </div>
  );
};