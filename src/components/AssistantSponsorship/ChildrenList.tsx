import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ChildrenListProps {
  children: Array<{
    id: string;
    name: string;
    age: number;
    birth_date: string;
    city: string;
    comments: string;
    created_at: string;
    description: string;
    end_date: string;
    gender: string;
    sponsorships: Array<{ id: string; sponsor: { id: string; name: string; } }>;
  }>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectChild: (id: string) => void;
  onRemoveSponsorship?: (childId: string) => void;
}

export const ChildrenList = ({
  children,
  searchTerm,
  onSearchChange,
  onSelectChild,
  onRemoveSponsorship
}: ChildrenListProps) => {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleItem = (id: string) => {
    setOpenItems(current => 
      current.includes(id) 
        ? current.filter(item => item !== id)
        : [...current, id]
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder={t("searchChildren")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="space-y-2">
        {filteredChildren.map(child => (
          <Card key={child.id} className="overflow-hidden">
            <Collapsible
              open={openItems.includes(child.id)}
              onOpenChange={() => toggleItem(child.id)}
            >
              <CollapsibleTrigger className="flex justify-between items-center w-full p-4 hover:bg-gray-50">
                <div>
                  <h3 className="text-lg font-semibold">{child.name}</h3>
                  <p className="text-sm text-gray-500">{child.age} ans</p>
                </div>
                {openItems.includes(child.id) ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 space-y-4">
                  <div className="space-y-2">
                    <p>{t("city")}: {child.city}</p>
                    <p>{t("comments")}: {child.comments}</p>
                    {child.description && (
                      <p>{t("description")}: {child.description}</p>
                    )}
                  </div>
                  <div className="flex justify-between gap-2">
                    <Button onClick={() => onSelectChild(child.id)}>
                      {t("select")}
                    </Button>
                    {child.sponsorships?.length > 0 && onRemoveSponsorship && (
                      <Button 
                        variant="destructive" 
                        onClick={() => onRemoveSponsorship(child.id)}
                      >
                        {t("removeSponsorship")}
                      </Button>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};