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
    <div>
      <input
        type="text"
        placeholder={t("searchChildren")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {filteredChildren.map(child => (
          <Card key={child.id} className="p-4">
            <h3 className="text-lg font-semibold">{child.name}</h3>
            <p>{t("age")}: {child.age}</p>
            <p>{t("city")}: {child.city}</p>
            <p>{t("comments")}: {child.comments}</p>
            <div className="flex justify-between mt-4">
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
          </Card>
        ))}
      </div>
    </div>
  );
};