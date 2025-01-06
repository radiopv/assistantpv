import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";

interface TextContentProps {
  description?: string;
  story?: string;
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
}

export const TextContent = ({ description, story, isEditing, onChange }: TextContentProps) => {
  const { t } = useLanguage();

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">{t("description")}</p>
          <Textarea
            value={description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            className="min-h-[80px]"
            placeholder={t("descriptionPlaceholder")}
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{t("story")}</p>
          <Textarea
            value={story || ""}
            onChange={(e) => onChange("story", e.target.value)}
            className="min-h-[80px]"
            placeholder={t("storyPlaceholder")}
          />
        </div>
      </div>
    );
  }

  if (!description && !story) return null;

  return (
    <div className="space-y-4">
      {description && (
        <div>
          <p className="text-sm text-gray-500 mb-1">{t("description")}</p>
          <ScrollArea className="h-20">
            <p className="text-sm text-gray-600">{description}</p>
          </ScrollArea>
        </div>
      )}
      {story && (
        <div>
          <p className="text-sm text-gray-500 mb-1">{t("story")}</p>
          <ScrollArea className="h-20">
            <p className="text-sm text-gray-600">{story}</p>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};