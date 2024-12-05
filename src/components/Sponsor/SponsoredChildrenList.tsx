import { Card } from "@/components/ui/card";
import { SponsoredChild } from "@/types/sponsorship";

interface SponsoredChildrenListProps {
  children: SponsoredChild[];
  selectedChild: string | null;
  onSelectChild: (childId: string) => void;
}

export const SponsoredChildrenList = ({ 
  children, 
  selectedChild, 
  onSelectChild 
}: SponsoredChildrenListProps) => {
  return (
    <div className="grid gap-6">
      {children.map((child) => (
        <Card 
          key={child.id} 
          className={`p-4 cursor-pointer transition-colors ${
            selectedChild === child.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectChild(child.id)}
        >
          <div className="flex gap-4">
            <div className="w-24 h-24">
              <img
                src={child.photo_url || '/placeholder.svg'}
                alt={child.name}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{child.name}</h3>
              <p className="text-sm text-gray-600">{child.city}</p>
              <p className="text-sm text-gray-600">{child.age} ans</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};