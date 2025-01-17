import { Need } from "@/types/needs";
import { translateNeedCategory } from "@/utils/needsTranslation";

interface ChildNeedsListProps {
  needs: Need[];
}

export const ChildNeedsList = ({ needs }: ChildNeedsListProps) => {
  if (!Array.isArray(needs) || needs.length === 0) {
    return <p className="text-sm text-gray-500">Aucun besoin enregistré</p>;
  }

  return (
    <div className="grid gap-2">
      {needs.map((need: any, index: number) => (
        <div
          key={`${need.category}-${index}`}
          className={`px-3 py-2 rounded-lg ${
            need.is_urgent
              ? "bg-red-600 text-white border border-red-700"
              : "bg-orange-50 text-orange-800 border border-orange-200"
          }`}
        >
          <div className="font-medium">
            {need.is_urgent && <span className="font-bold mr-2">URGENT</span>}
            {translateNeedCategory(need.category)}
            {need.is_urgent && <span className="ml-1 font-bold">(!)</span>}
          </div>
          {need.description && (
            <p className={`text-xs mt-1 ${need.is_urgent ? 'text-red-100' : 'text-gray-600'} italic`}>
              {need.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};