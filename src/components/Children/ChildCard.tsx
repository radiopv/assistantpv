import { Card } from "@/components/ui/card";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { convertJsonToNeeds } from "@/types/needs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NeedCheckboxes } from "./Needs/NeedCheckboxes";
import { notifyActiveSponsor } from "@/utils/sponsor-notifications";
import { useNavigate } from "react-router-dom";
import { PhotoSection } from "./CardComponents/PhotoSection";
import { CardHeader } from "./CardComponents/CardHeader";
import { CardActions } from "./CardComponents/CardActions";

interface ChildCardProps {
  child: any;
  onViewProfile: (id: string) => void;
  onSponsorClick: (child: any) => void;
}

const formatAge = (birthDate: string | undefined | null) => {
  const { t } = useLanguage();
  
  if (!birthDate) {
    return t("ageNotAvailable");
  }

  const today = new Date();
  const birth = parseISO(birthDate);
  const years = differenceInYears(today, birth);
  
  if (years === 0) {
    const months = differenceInMonths(today, birth);
    return `${months} ${t("months")}`;
  }
  
  return `${years} ${t("years")}`;
};

export const ChildCard = ({ child, onViewProfile }: ChildCardProps) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedChild, setEditedChild] = useState(child);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setEditedChild(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNeedsChange = (needs: any[]) => {
    setEditedChild(prev => ({
      ...prev,
      needs: needs
    }));
  };

  const handlePhotoUpdate = (url: string) => {
    setEditedChild(prev => ({
      ...prev,
      photo_url: url
    }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('children')
        .update({
          name: editedChild.name,
          description: editedChild.description,
          story: editedChild.story,
          comments: editedChild.comments,
          photo_url: editedChild.photo_url,
          city: editedChild.city,
          needs: editedChild.needs
        })
        .eq('id', child.id);

      if (error) throw error;

      await notifyActiveSponsor(
        child.id,
        "Mise à jour des informations",
        `Les informations de ${editedChild.name} ont été mises à jour. Vous pouvez consulter les changements dans son profil.`
      );

      toast({
        title: t("childUpdated"),
        description: t("childUpdateSuccess"),
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating child:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("childUpdateError"),
      });
    }
  };

  const handleCardClick = () => {
    if (!isEditing) {
      navigate(`/child/${child.id}`);
    }
  };

  const handleLearnMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/child/${child.id}`);
  };

  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <PhotoSection
        child={editedChild}
        editing={isEditing}
        onPhotoUpdate={handlePhotoUpdate}
      />

      <CardHeader
        name={editedChild.name}
        isSponsored={child.is_sponsored}
        editing={isEditing}
        onNameChange={(value) => handleInputChange('name', value)}
        translations={t}
      />

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="text-gray-400">{t("age")}</p>
            <p className="font-medium">{formatAge(child.birth_date)}</p>
          </div>
          <div>
            <p className="text-gray-400">{t("city")}</p>
            {isEditing ? (
              <Input
                value={editedChild.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="font-medium">{child.city}</p>
            )}
          </div>
          {child.is_sponsored && child.sponsor_name && (
            <div className="col-span-2">
              <p className="text-gray-400">{t("sponsor")}</p>
              <p className="font-medium text-blue-600">{child.sponsor_name}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t("description")}</p>
                <Textarea
                  value={editedChild.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t("story")}</p>
                <Textarea
                  value={editedChild.story}
                  onChange={(e) => handleInputChange('story', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t("comments")}</p>
                <Textarea
                  value={editedChild.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </>
          ) : (
            <>
              {child.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("description")}</p>
                  <ScrollArea className="h-20">
                    <p className="text-sm text-gray-600">{child.description}</p>
                  </ScrollArea>
                </div>
              )}
              {child.story && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("story")}</p>
                  <ScrollArea className="h-20">
                    <p className="text-sm text-gray-600">{child.story}</p>
                  </ScrollArea>
                </div>
              )}
              {child.comments && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("comments")}</p>
                  <ScrollArea className="h-20">
                    <p className="text-sm text-gray-600">{child.comments}</p>
                  </ScrollArea>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">{t("needs")}</p>
          {isEditing ? (
            <NeedCheckboxes
              needs={convertJsonToNeeds(editedChild.needs)}
              onNeedsChange={handleNeedsChange}
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {convertJsonToNeeds(child.needs).map((need, index) => (
                <div
                  key={`${need.category}-${index}`}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    need.is_urgent
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {need.category}
                  {need.is_urgent && " (!)"} 
                  {need.description && (
                    <p className="text-xs mt-1 text-gray-600">{need.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <CardActions
          editing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          onLearnMore={handleLearnMore}
          translations={t}
        />
      </div>
    </Card>
  );
};
