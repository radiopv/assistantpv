import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { convertJsonToNeeds } from "@/types/needs";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChildCardProps {
  child: any;
  onViewProfile: (id: string) => void;
  onSponsorClick: (child: any) => void;
}

export const ChildCard = ({ child, onViewProfile, onSponsorClick }: ChildCardProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSponsorClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      navigate(`/become-sponsor?child=${child.id}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: child.id,
          full_name: user.name,
          email: user.email,
          status: 'pending',
          sponsor_id: user.id,
          is_long_term: true,
          terms_accepted: true
        });

      if (error) throw error;

      toast.success(t("sponsorshipRequestSent", { name: child.name }));
      onSponsorClick(child);
    } catch (error) {
      console.error('Error submitting sponsorship request:', error);
      toast.error(t("errorSendingRequest"));
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative pb-[75%] bg-gray-100">
        <img
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow space-y-2">
          <h3 className="text-lg font-semibold line-clamp-1">{child.name}</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 line-clamp-1">{child.age} ans</p>
            <p className="text-sm text-gray-600 line-clamp-1">{child.city}</p>
          </div>
          {child.needs && (
            <div className="flex flex-wrap gap-1.5">
              {convertJsonToNeeds(child.needs).map((need: any, index: number) => (
                <Badge
                  key={`${need.category}-${index}`}
                  variant={need.is_urgent ? "destructive" : "secondary"}
                  className={`text-xs truncate max-w-[150px] ${need.is_urgent ? 'bg-red-500 hover:bg-red-600' : ''}`}
                >
                  {need.category}
                  {need.is_urgent && " (!)"} 
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2 mt-3">
          <Button
            onClick={() => onViewProfile(child.id)}
            className="w-full"
            variant="secondary"
          >
            {t("viewProfile")}
          </Button>
          {!child.is_sponsored && (
            <Button
              onClick={handleSponsorClick}
              className="w-full"
            >
              {t("sponsor")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};