interface ChildInfoProps {
  description?: string;
  needs?: any[];
}

export const ChildInfo = ({ description, needs = [] }: ChildInfoProps) => {
  return (
    <div className="flex-grow space-y-4">
      {description && (
        <div className="bg-white/60 rounded-lg p-3">
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      )}
    </div>
  );
};