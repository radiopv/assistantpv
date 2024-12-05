import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface NeedBadgeProps {
  category: string;
  isUrgent?: boolean;
  isSelected?: boolean;
  description?: string;
  comment?: string;
  onNeedClick?: () => void;
  onCommentChange?: (comment: string) => void;
  onSubmit?: (isUrgent: boolean) => void;
  onClose?: () => void;
}

const CATEGORY_STYLES = {
  education: "bg-yellow-400 hover:bg-yellow-500 text-black",
  jouet: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  vetement: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  nourriture: "bg-blue-500 hover:bg-blue-600 text-white",
  medicament: "bg-blue-600 hover:bg-blue-700 text-white",
  hygiene: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  autre: "bg-gray-100 hover:bg-gray-200 text-gray-900"
};

export const NeedBadge = ({
  category,
  isUrgent = false,
  isSelected = false,
  description = "",
  comment = "",
  onNeedClick,
  onCommentChange,
  onSubmit,
  onClose,
}: NeedBadgeProps) => {
  const { t } = useLanguage();

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'education':
        return 'Educación';
      case 'jouet':
        return 'Juguetes';
      case 'vetement':
        return 'Ropa';
      case 'nourriture':
        return 'Alimentación';
      case 'medicament':
        return 'Medicamentos';
      case 'hygiene':
        return 'Higiene';
      case 'autre':
        return 'Otros';
      default:
        return category;
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost"
        className={`w-full justify-center px-4 py-2 rounded-md transition-colors ${CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES]}`}
        onClick={onNeedClick}
      >
        {getCategoryLabel(category)}
        {isUrgent && <span className="ml-2 text-red-600 font-bold">(!)</span>}
      </Button>
    </div>
  );
};