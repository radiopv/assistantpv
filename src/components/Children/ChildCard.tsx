import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { convertJsonToNeeds } from "@/types/needs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChildCardProps {
  child: any;
  onViewProfile: (id: string) => void;
  onSponsorClick: (child: any) => void;
}

const NEED_CATEGORIES = {
  education: "Éducation",
  jouet: "Jouet",
  vetement: "Vêtement",
  nourriture: "Nourriture",
  medicament: "Médicament",
  hygiene: "Hygiène",
  autre: "Autre"
};

const formatAge = (birthDate: string) => {
  const { t } = useLanguage();
  const today = new Date();
  const birth = parseISO(birthDate);
  const years = differenceInYears(today, birth);
  
  if (years === 0) {
    const months = differenceInMonths(today, birth);
    return `${months} ${t("months")}`;
  }
  
  return `${years} ${t("years")}`;
};

export const ChildCard = ({ child, onViewProfile, onSponsorClick }: ChildCardProps) => {
  const { t } = useLanguage();
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const handleNeedClick = (needCategory: string) => {
    setSelectedNeed(needCategory === selectedNeed ? null : needCategory);
    setComment("");
  };

  const handleCommentSubmit = (needCategory: string, isUrgent: boolean) => {
    console.log("Need category:", needCategory);
    console.log("Comment:", comment);
    console.log("Is urgent:", isUrgent);
    setSelectedNeed(null);
    setComment("");
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs ${
              !child.is_sponsored
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {child.is_sponsored ? t("sponsored") : t("available")}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{child.name}</h3>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p>{formatAge(child.birth_date)}</p>
            <p>{child.city}</p>
            {child.is_sponsored && child.sponsor_name && (
              <p className="font-medium text-blue-600">
                {t("sponsored")} {t("by")}: {child.sponsor_name}
              </p>
            )}
          </div>
        </div>

        {child.description && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-1">{t("description")}</h4>
            <ScrollArea className="h-20">
              <p className="text-sm text-gray-600">{child.description}</p>
            </ScrollArea>
          </div>
        )}

        {child.story && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-1">{t("story")}</h4>
            <ScrollArea className="h-20">
              <p className="text-sm text-gray-600">{child.story}</p>
            </ScrollArea>
          </div>
        )}

        {child.comments && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-1">{t("comments")}</h4>
            <ScrollArea className="h-20">
              <p className="text-sm text-gray-600">{child.comments}</p>
            </ScrollArea>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-sm text-gray-700">{t("needs")}</h4>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="default" className="text-xs">
                {t("normalNeed")}
              </Badge>
              <Badge variant="destructive" className="text-xs">
                {t("urgentNeed")}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {convertJsonToNeeds(child.needs).map((need, index) => (
              <div key={`${need.category}-${index}`} className="relative">
                <Badge 
                  variant={need.is_urgent ? "destructive" : "default"}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleNeedClick(need.category)}
                >
                  {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                </Badge>

                {selectedNeed === need.category && (
                  <Card className="absolute z-10 top-full mt-2 p-3 w-64 space-y-3">
                    <p className="text-sm font-medium">
                      {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                    </p>
                    {need.description && (
                      <p className="text-sm text-gray-600">{need.description}</p>
                    )}
                    <Input
                      placeholder={t("addComment")}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={need.is_urgent ? "default" : "destructive"}
                        onClick={() => handleCommentSubmit(need.category, !need.is_urgent)}
                      >
                        {need.is_urgent ? t("markAsNormal") : t("markAsUrgent")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedNeed(null)}
                      >
                        {t("close")}
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1" 
            variant="outline"
            onClick={() => onViewProfile(child.id)}
          >
            {t("profile")}
          </Button>

          <Button 
            variant="outline"
            onClick={() => onSponsorClick(child)}
          >
            {child.is_sponsored ? t("editOrRemoveSponsor") : t("addSponsor")}
          </Button>
        </div>
      </div>
    </Card>
  );
};