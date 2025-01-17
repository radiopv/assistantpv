import { Info } from "lucide-react";

interface ChildDescriptionProps {
  description: string | null;
  story: string | null;
}

export const ChildDescription = ({ description, story }: ChildDescriptionProps) => {
  if (!description && !story) return null;

  return (
    <>
      {description && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-cuba-coral mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed bg-white/50 p-4 rounded-lg">
            {description}
          </p>
        </div>
      )}

      {story && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-cuba-coral mb-3">Histoire</h3>
          <p className="text-gray-700 leading-relaxed bg-white/50 p-4 rounded-lg italic">
            {story}
          </p>
        </div>
      )}
    </>
  );
};