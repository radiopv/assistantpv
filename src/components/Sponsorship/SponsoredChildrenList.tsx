import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChildNeeds } from "@/components/Dashboard/ChildrenNeeds/ChildNeeds";

interface SponsoredChildrenListProps {
  children: any[];
}

export const SponsoredChildrenList = ({ children }: SponsoredChildrenListProps) => {
  // Filter out duplicates and keep only sponsored children
  const uniqueChildren = children.filter((child, index, self) =>
    index === self.findIndex((c) => c.id === child.id) && child.is_sponsored
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {uniqueChildren.map((child) => (
        <Card key={child.id} className="overflow-hidden">
          <div className="aspect-square relative h-48">
            <img
              src={child.photo_url || "/placeholder.svg"}
              alt={child.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 space-y-4">
            {/* Basic Info */}
            <div>
              <h3 className="font-semibold text-lg">{child.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>{child.age} ans</p>
                <p>{child.city}</p>
              </div>
            </div>

            {/* Description */}
            {child.description && (
              <div>
                <h4 className="font-medium text-sm mb-1">Description</h4>
                <p className="text-sm text-gray-700">{child.description}</p>
              </div>
            )}

            {/* Story */}
            {child.story && (
              <div>
                <h4 className="font-medium text-sm mb-1">Histoire</h4>
                <p className="text-sm text-gray-700 italic">{child.story}</p>
              </div>
            )}

            {/* Sponsorship Info */}
            {child.sponsor_name && (
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">
                  Parrainé par: <span className="font-medium">{child.sponsor_name}</span>
                </p>
              </div>
            )}

            {/* Needs Section */}
            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm mb-2">Besoins</h4>
              <ChildNeeds child={child} needs={child.needs} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
