import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { MessageList } from "@/components/Messages/MessageList";

const SponsorMessages = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t('messages')}</h1>
      
      <Card className="max-w-4xl mx-auto">
        <div className="p-4">
          <MessageList onSelectMessage={() => {}} />
        </div>
      </Card>
    </div>
  );
};

export default SponsorMessages;