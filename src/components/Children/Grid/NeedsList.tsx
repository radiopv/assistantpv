import { Need } from "@/types/needs";

interface NeedsListProps {
  needs: Need[];
}

export const NeedsList = ({ needs }: NeedsListProps) => (
  <div className="space-y-1">
    {Array.isArray(needs) && needs.length > 0 && needs.map((need: Need, index: number) => (
      <div
        key={`${need.category}-${index}`}
        className={`p-2 rounded-lg ${
          need.is_urgent
            ? "bg-[#ea384c] text-white font-medium"
            : "bg-orange-50 border border-orange-200 text-orange-700"
        }`}
      >
        <div className="text-sm font-medium truncate">
          {need.category}
          {need.is_urgent && " (!)"} 
        </div>
        {need.description && (
          <p className="text-sm opacity-90 mt-1">{need.description}</p>
        )}
      </div>
    ))}
  </div>
);