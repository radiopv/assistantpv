import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Child {
  id: string;
  name: string;
  sponsor?: {
    id: string;
    name: string;
  } | null;
}

interface ChildrenListProps {
  children: Child[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectChild: (childId: string) => void;
  onRemoveSponsorship: (childId: string) => void;
}

export function ChildrenList({
  children,
  searchTerm,
  onSearchChange,
  onSelectChild,
  onRemoveSponsorship,
}: ChildrenListProps) {
  const filteredChildren = children.filter((child) =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Enfants</h2>
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Rechercher un enfant..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredChildren.map((child) => (
          <div
            key={child.id}
            className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{child.name}</p>
              <p className="text-sm text-gray-600">
                {child.sponsor
                  ? `Parrainé par ${child.sponsor.name}`
                  : "Non parrainé"}
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => onSelectChild(child.id)}
              >
                Sélectionner
              </Button>
              {child.sponsor && (
                <Button
                  variant="destructive"
                  onClick={() => onRemoveSponsorship(child.id)}
                >
                  Retirer
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}