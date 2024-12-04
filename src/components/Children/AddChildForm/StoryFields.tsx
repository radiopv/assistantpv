import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StoryFieldsProps {
  description: string;
  story: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  translations: any;
}

export const StoryFields = ({ description, story, handleChange, translations }: StoryFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="description">{translations.description}</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={handleChange}
          placeholder={translations.descriptionPlaceholder}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="story">{translations.story}</Label>
        <Textarea
          id="story"
          name="story"
          value={story}
          onChange={handleChange}
          placeholder={translations.storyPlaceholder}
          className="min-h-[150px]"
        />
      </div>
    </>
  );
};