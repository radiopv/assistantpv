import { useLanguage } from "@/contexts/LanguageContext";

interface StorySectionProps {
  description: string | null;
  story: string | null;
}

export const StorySection = ({ description, story }: StorySectionProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      description: "Description",
      story: "Histoire"
    },
    es: {
      description: "Descripción",
      story: "Historia"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="space-y-6">
      {description && (
        <div>
          <h4 className="font-medium mb-2">{t.description}</h4>
          <p className="text-gray-600">{description}</p>
        </div>
      )}
      {story && (
        <div>
          <h4 className="font-medium mb-2">{t.story}</h4>
          <p className="text-gray-600">{story}</p>
        </div>
      )}
    </div>
  );
};