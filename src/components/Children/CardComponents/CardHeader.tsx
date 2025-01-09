import { Input } from "@/components/ui/input";

interface CardHeaderProps {
  name: string;
  isSponsored: boolean;
  editing: boolean;
  onNameChange: (value: string) => void;
  translations: any;
}

export const CardHeader = ({ name, isSponsored, editing, onNameChange, translations }: CardHeaderProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
      <div className="flex justify-between items-start">
        {editing ? (
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="text-white bg-transparent border-white/30"
          />
        ) : (
          <h3 className="font-semibold text-lg text-white">{name}</h3>
        )}
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            !isSponsored
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {isSponsored ? translations.sponsored : translations.available}
        </span>
      </div>
    </div>
  );
};