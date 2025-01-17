interface ChildStoryProps {
  story?: string;
}

export const ChildStory = ({ story }: ChildStoryProps) => {
  if (!story) return null;

  return (
    <div className="bg-white/80 rounded-lg p-3">
      <h4 className="font-medium text-sm mb-1 text-cuba-warmGray">Histoire</h4>
      <p className="text-sm text-gray-700 italic">{story}</p>
    </div>
  );
};