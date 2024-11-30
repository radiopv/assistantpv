import { Book, Gift, Shirt, Pizza, Pill, Bath, HelpCircle } from "lucide-react";

interface NeedCategoryIconProps {
  category: string;
  className?: string;
}

export const NeedCategoryIcon = ({ category, className = "w-4 h-4" }: NeedCategoryIconProps) => {
  switch (category) {
    case "education":
      return <Book className={className} />;
    case "jouet":
      return <Gift className={className} />;
    case "vetement":
      return <Shirt className={className} />;
    case "nourriture":
      return <Pizza className={className} />;
    case "medicament":
      return <Pill className={className} />;
    case "hygiene":
      return <Bath className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};