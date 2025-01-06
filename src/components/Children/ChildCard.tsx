import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { convertJsonToNeeds } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ProfilePhotoSection } from "./ProfilePhoto/ProfilePhotoSection";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NeedCheckboxes } from "./Needs/NeedCheckboxes";
import { CardHeader } from "./ChildCard/CardHeader";
import { BasicInfo } from "./ChildCard/BasicInfo";
import { TextContent } from "./ChildCard/TextContent";
import { MissingFields } from "./ChildCard/MissingFields";

interface ChildCardProps {
  child: any;
  onViewProfile: (id: string) => void;
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

const getMissingFields = (child: any) => {
  const missingFields = [];
  if (!child.gender) missingFields.push("Genre");
  if (!child.birth_date) missingFields.push("Date de naissance");
  if (!child.name) missingFields.push("Nom");
  if (!child.photo_url) missingFields.push("Photo");
  if (!child.city) missingFields.push("Ville");
  if (!child.story) missingFields.push("Histoire");
  if (!child.description) missingFields.push("Description");
  return missingFields;
};

export const ChildCard = ({ child, onViewProfile }: ChildCardProps) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedChild, setEditedChild] = useState(child);

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

  const missingFields = getMissingFields(child);

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        {isEditing ? (
          <ProfilePhotoSection
            child={editedChild}
            editing={true}
            onPhotoUpdate={handlePhotoUpdate}
          />
        ) : (
          <img
            src={child.photo_url || "/placeholder.svg"}
            alt={child.name}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <CardHeader
          name={isEditing ? editedChild.name : child.name}
          isSponsored={child.is_sponsored}
          isEditing={isEditing}
          onNameChange={(value) => handleInputChange('name', value)}
        />
      </div>

      <div className="p-4 space-y-4">
        <BasicInfo
          age={formatAge(child.birth_date)}
          city={isEditing ? editedChild.city : child.city}
          sponsorName={child.sponsor_name}
          isSponsored={child.is_sponsored}
          isEditing={isEditing}
          onCityChange={(value) => handleInputChange('city', value)}
        />

        <TextContent
          description={isEditing ? editedChild.description : child.description}
          story={isEditing ? editedChild.story : child.story}
          isEditing={isEditing}
          onChange={handleInputChange}
        />

        {isEditing ? (
          <div>
            <p className="text-sm text-gray-500 mb-1">{t("needs")}</p>
            <NeedCheckboxes
              needs={convertJsonToNeeds(editedChild.needs)}
              onNeedsChange={handleNeedsChange}
            />
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-1">{t("needs")}</p>
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
                </div>
              ))}
            </div>
          </div>
        )}
        
        {missingFields.length > 0 && (
          <MissingFields missingFields={missingFields} />
        )}
        
        <div className="flex flex-col items-center gap-2">
          {isEditing ? (
            <>
              <Button 
                className="w-full sm:w-3/4 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSave}
              >
                {t("save")}
              </Button>
              <Button 
                className="w-full sm:w-3/4 bg-gray-100 hover:bg-gray-200 text-gray-900"
                onClick={() => setIsEditing(false)}
              >
                {t("cancel")}
              </Button>
            </>
          ) : (
            <Button 
              className="w-full sm:w-3/4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200" 
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              {t("edit")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};