import { Badge } from "@/components/ui/badge";

interface DonationCategoriesProps {
  items: {
    category_name: string;
    quantity: number;
  }[];
}

export const DonationCategories = ({ items }: DonationCategoriesProps) => {
  if (!items?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <Badge key={index} variant="secondary">
          {item.category_name} ({item.quantity})
        </Badge>
      ))}
    </div>
  );
};