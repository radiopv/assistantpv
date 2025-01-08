import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { SponsorChildrenList } from "./SponsorChildrenList";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SponsorCardProps {
  sponsor: any;
  onVerificationChange: (sponsorId: string, checked: boolean) => void;
  onRemoveChild: (sponsorId: string, childId: string) => void;
  onAddChild: (sponsorId: string) => void;
  availableChildren: any[];
}

export const SponsorCard = ({
  sponsor,
  onVerificationChange,
  onRemoveChild,
  onAddChild,
  availableChildren
}: SponsorCardProps) => {
  const { t } = useLanguage();

  const handleAddChild = async (childId: string) => {
    try {
      // Vérifier si l'enfant est déjà parrainé
      const { data: existingSponsorships } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('child_id', childId)
        .eq('status', 'active');

      if (existingSponsorships && existingSponsorships.length > 0) {
        toast.error(t("childAlreadySponsored"));
        return;
      }

      onAddChild(childId);
    } catch (error) {
      console.error('Error checking sponsorship:', error);
      toast.error(t("errorCheckingSponsorship"));
    }
  };

  return (
    <Card key={sponsor.id} className="p-4 w-full">
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          checked={sponsor.is_verified}
          onCheckedChange={(checked) => 
            onVerificationChange(sponsor.id, checked as boolean)
          }
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold truncate">{sponsor.name}</h3>
          <p className="text-sm text-gray-500 truncate">{sponsor.email}</p>
        </div>
      </div>
      <SponsorChildrenList
        sponsorships={sponsor.sponsorships}
        availableChildren={availableChildren}
        onAddChild={handleAddChild}
        onRemoveChild={(childId) => onRemoveChild(sponsor.id, childId)}
      />
    </Card>
  );
};