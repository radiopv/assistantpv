import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { convertJsonToNeeds } from "@/types/needs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { NeedsSection } from "./Needs/NeedsSection";

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
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <img
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-white">{child.name}</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                !child.is_sponsored
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {child.is_sponsored ? t("sponsored") : t("available")}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="text-gray-400">{t("age")}</p>
            <p className="font-medium">{formatAge(child.birth_date)}</p>
          </div>
          <div>
            <p className="text-gray-400">{t("city")}</p>
            <p className="font-medium">{child.city}</p>
          </div>
          {child.is_sponsored && child.sponsor_name && (
            <div className="col-span-2">
              <p className="text-gray-400">{t("sponsor")}</p>
              <p className="font-medium text-blue-600">{child.sponsor_name}</p>
            </div>
          )}
        </div>

        {child.description && (
          <div>
            <ScrollArea className="h-20">
              <p className="text-sm text-gray-600">{child.description}</p>
            </ScrollArea>
          </div>
        )}

        <NeedsSection
          needs={convertJsonToNeeds(child.needs)}
          selectedNeed={selectedNeed}
          comment={comment}
          onNeedClick={handleNeedClick}
          onCommentChange={setComment}
          onCommentSubmit={handleCommentSubmit}
          onClose={() => setSelectedNeed(null)}
        />
        
        <div className="flex flex-col items-center gap-2">
          <Button 
            className="w-full sm:w-3/4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200" 
            variant="outline"
            onClick={() => onViewProfile(child.id)}
          >
            {t("profile")}
          </Button>

          <Button 
            className="w-full sm:w-3/4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
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