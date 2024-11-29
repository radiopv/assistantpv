import { 
  Book, 
  Shirt, 
  Apple, 
  Stethoscope, 
  Sparkles, 
  GraduationCap,
  HelpCircle 
} from "lucide-react";

interface NeedCategoryIconProps {
  category: string;
  className?: string;
}

export const NeedCategoryIcon = ({ category, className = "" }: NeedCategoryIconProps) => {
  const iconProps = {
    className: `w-5 h-5 ${className}`,
  };

  switch (category) {
    case "education":
      return <GraduationCap {...iconProps} />;
    case "jouet":
      return <Sparkles {...iconProps} />;
    case "vetement":
      return <Shirt {...iconProps} />;
    case "nourriture":
      return <Apple {...iconProps} />;
    case "medicament":
      return <Stethoscope {...iconProps} />;
    case "hygiene":
      return <Book {...iconProps} />;
    default:
      return <HelpCircle {...iconProps} />;
  }
};