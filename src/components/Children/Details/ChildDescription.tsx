import { Card } from "@/components/ui/card";

interface ChildDescriptionProps {
  description: string | null;
  story: string | null;
  city: string | null;
}

export const ChildDescription = ({ description, story, city }: ChildDescriptionProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {city && (
          <div>
            <h3 className="font-medium mb-2">Ville</h3>
            <p>{city}</p>
          </div>
        )}
        {description && (
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="whitespace-pre-wrap">{description}</p>
          </div>
        )}
        {story && (
          <div>
            <h3 className="font-medium mb-2">Histoire</h3>
            <p className="whitespace-pre-wrap">{story}</p>
          </div>
        )}
      </div>
    </Card>
  );
};