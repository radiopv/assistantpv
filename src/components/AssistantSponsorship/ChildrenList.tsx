import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

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

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder={t("searchChildren")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4"
      />
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {filteredChildren.map(child => (
          <Card key={child.id} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{child.name}</h3>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">{t("age")}: {child.age}</p>
              <p className="text-sm text-gray-600">{t("city")}: {child.city}</p>
              <p className="text-sm text-gray-600">{t("comments")}: {child.comments}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <Button 
                className="w-full sm:w-auto" 
                onClick={() => onSelectChild(child.id)}
              >
                {t("select")}
              </Button>
              {child.sponsorships.length > 0 && onRemoveSponsorship && (
                <Button 
                  variant="destructive" 
                  className="w-full sm:w-auto"
                  onClick={() => onRemoveSponsorship(child.id)}
                >
                  {t("removeSponsorship")}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};