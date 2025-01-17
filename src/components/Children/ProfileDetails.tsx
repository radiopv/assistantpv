import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { convertJsonToNeeds } from "@/types/needs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileDetailsProps {
  child: any;
  editing: boolean;
  onChange: (field: string, value: any) => void;
  onPhotoUpdate: (url: string) => void;
}

export const ProfileDetails = ({ child, editing, onChange, onPhotoUpdate }: ProfileDetailsProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [photo, setPhoto] = useState<File | null>(null);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${child.id}/profile.${fileExt}`;

        try {
          console.log("Uploading photo...");
          const { error: uploadError } = await supabase.storage
            .from('children-photos')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('children-photos')
            .getPublicUrl(filePath);

          console.log("Photo uploaded successfully, updating child record...");
          onPhotoUpdate(publicUrl);
          toast({
            title: t('successTitle'),
            description: t('successMessage'),
          });
        } catch (error) {
          console.error("Error uploading photo:", error);
          toast({
            variant: "destructive",
            title: t('errorTitle'),
            description: t('errorMessage'),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = async (field: string, value: any) => {
    try {
      console.log(`Updating child field: ${field} with value:`, value);
      
      // Update child data
      const { error: updateError } = await supabase
        .from('children')
        .update({ [field]: value })
        .eq('id', child.id);

      if (updateError) throw updateError;

      console.log("Child data updated successfully");

      // Get active sponsor
      const { data: sponsorship } = await supabase
        .from('sponsorships')
        .select('sponsor_id')
        .eq('child_id', child.id)
        .eq('status', 'active')
        .single();

      if (sponsorship?.sponsor_id) {
        console.log("Creating notification for sponsor:", sponsorship.sponsor_id);
        
        // Create notification for field update
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            recipient_id: sponsorship.sponsor_id,
            type: 'child_update',
            title: 'Mise à jour des informations',
            content: `Les informations de ${child.name} ont été mises à jour (${field})`,
            link: `/children/${child.id}`
          });

        if (notifError) {
          console.error("Error creating notification:", notifError);
        } else {
          console.log("Notification created successfully");
        }
      }

      // Create audit log
      const { error: auditError } = await supabase
        .from('children_audit_logs')
        .insert({
          child_id: child.id,
          action: 'field_updated',
          changes: {
            field,
            old_value: child[field],
            new_value: value
          }
        });

      if (auditError) {
        console.error("Error creating audit log:", auditError);
      } else {
        console.log("Audit log created successfully");
      }

      onChange(field, value);
    } catch (error) {
      console.error("Error updating child:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour"
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={child.photo_url} alt={child.name} />
          <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {editing && (
          <div className="ml-4">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer text-blue-500">
              Changer la photo
            </label>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          {editing ? (
            <input
              type="text"
              value={child.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          ) : (
            <p className="text-gray-900">{child.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ville</label>
          {editing ? (
            <input
              type="text"
              value={child.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          ) : (
            <p className="text-gray-900">{child.city}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Histoire</label>
          {editing ? (
            <textarea
              value={child.story}
              onChange={(e) => handleChange('story', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          ) : (
            <p className="text-gray-900">{child.story}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Besoins</label>
          {editing ? (
            <textarea
              value={JSON.stringify(child.needs)}
              onChange={(e) => handleChange('needs', JSON.parse(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
          ) : (
            <p className="text-gray-900">{JSON.stringify(child.needs)}</p>
          )}
        </div>
      </div>
    </Card>
  );
};