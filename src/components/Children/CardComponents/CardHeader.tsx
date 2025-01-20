interface CardHeaderProps {
  child: {
    name: string;
    photo_url?: string;
    birth_date?: string;
    age?: number;
  };
}

export const CardHeader = ({ child }: CardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div>
        <h3 className="text-lg font-semibold">{child.name}</h3>
        {child.age && (
          <p className="text-sm text-gray-600">
            {child.age} ans
          </p>
        )}
      </div>
    </div>
  );
};