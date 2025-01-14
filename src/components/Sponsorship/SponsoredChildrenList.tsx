import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { convertJsonToNeeds } from "@/types/needs";
import { differenceInYears, differenceInMonths, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsoredChildrenListProps {
  children: any[];
}

const formatAge = (birthDate: string | null) => {
  if (!birthDate) return "Âge inconnu";
  
  try {
    const today = new Date();
    const birth = parseISO(birthDate);
    const years = differenceInYears(today, birth);
    
    if (years === 0) {
      const months = differenceInMonths(today, birth);
      return `${months} mois`;
    }
    
    return `${years} ans`;
  } catch (error) {
    console.error('Error calculating age:', error);
    return "Âge inconnu";
  }
};

export const SponsoredChildrenList = ({ children }: SponsoredChildrenListProps) => {
  const { t } = useLanguage();
  
  // Filter out duplicates and keep only sponsored children
  const uniqueChildren = children.filter((child, index, self) =>
    index === self.findIndex((c) => c.id === child.id) && child.is_sponsored
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {uniqueChildren.map((child) => (
        <Card key={child.id} className="overflow-hidden bg-gradient-to-br from-white to-cuba-warmBeige border-cuba-softOrange/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="aspect-square relative h-48">
            <img
              src={child.photo_url || "/placeholder.svg"}
              alt={child.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="p-4 space-y-4">
            {/* Basic Info */}
            <div className="bg-white/80 rounded-lg p-3 shadow-sm">
              <h3 className="font-title text-xl text-cuba-deepOrange mb-2">{child.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>{formatAge(child.birth_date)}</p>
                <p>{child.city}</p>
              </div>
            </div>

            {/* Description */}
            {child.description && (
              <div className="bg-white/60 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-1 text-cuba-warmGray">Description</h4>
                <p className="text-sm text-gray-700">{child.description}</p>
              </div>
            )}

            {/* Story */}
            {child.story && (
              <div className="bg-white/60 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-1 text-cuba-warmGray">Histoire</h4>
                <p className="text-sm text-gray-700 italic">{child.story}</p>
              </div>
            )}

            {/* Sponsorship Info */}
            {child.sponsor_name && (
              <div className="pt-2 border-t border-cuba-softOrange/20">
                <p className="text-sm text-gray-600">
                  Parrainé par: <span className="font-medium">{child.sponsor_name}</span>
                </p>
              </div>
            )}

            {/* Needs Section */}
            <div className="pt-2 border-t border-cuba-softOrange/20">
              <h4 className="font-medium text-sm mb-2 text-cuba-warmGray">Besoins</h4>
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
                      {need.is_urgent && (
                        <span className="font-bold mr-2">URGENT</span>
                      )}
                      {need.category}
                      {need.is_urgent && (
                        <span className="ml-1 font-bold">(!)</span>
                      )}
                    </div>
                    {need.description && (
                      <p className={`text-xs mt-1 ${need.is_urgent ? 'text-red-100' : 'text-gray-600'} italic`}>
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
