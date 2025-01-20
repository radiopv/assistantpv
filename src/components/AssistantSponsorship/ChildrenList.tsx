import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { differenceInYears, parseISO } from "date-fns";

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
    photo_url: string | null;
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
}: ChildrenListProps) => {
  const { t } = useLanguage();

  const calculateAge = (birthDate: string): number => {
    try {
      return differenceInYears(new Date(), parseISO(birthDate));
    } catch (error) {
      console.error("Error calculating age:", error);
      return 0;
    }
  };

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
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="space-y-2">
        {filteredChildren.map(child => (
          <Card key={child.id} className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={child.photo_url || undefined} alt={child.name} />
                  <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-lg font-semibold">{child.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {calculateAge(child.birth_date)} ans
                  </span>
                  <span className="text-sm text-gray-500 ml-2">• {child.city}</span>
                </div>
              </div>
              <Button 
                onClick={() => onSelectChild(child.id)}
                size="sm"
                variant="outline"
              >
                {t("select")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};