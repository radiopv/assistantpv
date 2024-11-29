import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

export const SearchInput = ({ icon: Icon, className, ...props }: SearchInputProps) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <Input
        className={`${Icon ? 'pl-8' : ''} ${className}`}
        {...props}
      />
    </div>
  );
};