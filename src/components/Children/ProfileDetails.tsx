import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { convertJsonToNeeds, convertNeedsToJson, Need } from "@/types/needs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { translateNeedCategory } from "@/utils/needsTranslation";

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
      
      toast({
        title: t('successTitle'),
        description: t('successMessage')
      });
    } catch (error) {
      console.error("Error updating child:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour"
      });
    }
  };

  const handleNeedChange = (index: number, field: keyof Need, value: any) => {
    const currentNeeds = convertJsonToNeeds(child.needs);
    const updatedNeeds = [...currentNeeds];
    updatedNeeds[index] = { ...updatedNeeds[index], [field]: value };
    handleChange('needs', convertNeedsToJson(updatedNeeds));
  };

  const needs = convertJsonToNeeds(child.needs);

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
          <label className="block text-sm font-medium text-gray-700 mb-2">Besoins</label>
          {editing ? (
            <div className="space-y-4">
              {needs.map((need, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-4 mb-2">
                    <select
                      value={need.category}
                      onChange={(e) => handleNeedChange(index, 'category', e.target.value)}
                      className="border rounded p-2"
                    >
                      <option value="education">Éducation</option>
                      <option value="jouet">Jouets</option>
                      <option value="vetement">Vêtements</option>
                      <option value="nourriture">Nourriture</option>
                      <option value="medicament">Médicaments</option>
                      <option value="hygiene">Hygiène</option>
                      <option value="autre">Autre</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={need.is_urgent}
                        onCheckedChange={(checked) => 
                          handleNeedChange(index, 'is_urgent', checked)
                        }
                      />
                      <label>Urgent</label>
                    </div>
                  </div>
                  <textarea
                    value={need.description || ''}
                    onChange={(e) => handleNeedChange(index, 'description', e.target.value)}
                    placeholder="Description du besoin"
                    className="w-full border rounded p-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {needs.map((need, index) => (
                <div key={index} className={`p-3 rounded-lg ${need.is_urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'} border`}>
                  <Badge variant={need.is_urgent ? "destructive" : "secondary"}>
                    {translateNeedCategory(need.category)}
                  </Badge>
                  {need.description && (
                    <p className={`mt-2 text-sm ${need.is_urgent ? 'text-red-700' : 'text-gray-600'}`}>
                      {need.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};