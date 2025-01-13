import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { convertJsonToNeeds } from "@/types/needs";

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
              <div className="grid gap-2">
                {convertJsonToNeeds(child.needs).map((need, index) => (
                  <div
                    key={`${need.category}-${index}`}
                    className={`px-3 py-2 rounded-lg ${
                      need.is_urgent
                        ? "bg-red-600 text-white border border-red-700"
                        : "bg-orange-50 text-orange-800 border border-orange-200"
                    }`}
                  >
                    <div className="font-medium">
                      {need.category}
                      {need.is_urgent && (
                        <span className="ml-1 font-bold">(!)</span>
                      )}
                    </div>
                    {need.description && (
                      <p className={`text-xs mt-1 ${need.is_urgent ? 'text-red-100' : 'text-gray-600'} italic line-clamp-2`}>
                        {need.description}
                      </p>
                    )}
                  </div>
                ))}
                {(!Array.isArray(child.needs) || child.needs.length === 0) && (
                  <p className="text-sm text-gray-500">Aucun besoin enregistré</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};