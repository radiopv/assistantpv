import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface SponsorChildrenListProps {
  sponsorships: any[];
  availableChildren: any[];
  onAddChild: (childId: string) => void;
  onRemoveChild: (childId: string) => void;
}

export const SponsorChildrenList = ({
  sponsorships,
  availableChildren,
  onAddChild,
  onRemoveChild,
}: SponsorChildrenListProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const activeSponsorship = sponsorships?.filter(s => s.status === 'active') || [];

  return (
    <div className="space-y-2">
      {activeSponsorship.map((sponsorship: any) => (
        <div
          key={sponsorship.id}
          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
        >
          <span className="text-sm truncate flex-1">{sponsorship.children?.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveChild(sponsorship.children?.id)}
            className="h-8 w-8 p-0 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {t("addChild")}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="space-y-2 max-h-48 overflow-y-auto rounded-lg border bg-white p-2">
            {availableChildren.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <span className="text-sm truncate flex-1">{child.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddChild(child.id)}
                  className="h-8 w-8 p-0 ml-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};