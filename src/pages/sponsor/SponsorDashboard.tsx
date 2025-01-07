import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { MessageList } from "@/components/Messages/MessageList";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-primary">
        {t('welcome')} {user?.name}
      </h1>

      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('messages')}</h2>
          <MessageList onSelectMessage={() => {}} />
        </Card>
      </div>
    </div>
  );
};

export default SponsorDashboard;