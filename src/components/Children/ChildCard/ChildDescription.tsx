interface ChildDescriptionProps {
  description?: string;
}

export const ChildDescription = ({ description }: ChildDescriptionProps) => {
  if (!description) return null;

  return (
    <div className="bg-white/80 rounded-lg p-3">
      <h4 className="font-medium text-sm mb-1 text-cuba-warmGray">Description</h4>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
};