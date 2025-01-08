import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, Send, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Message } from "@/types/messages";

interface MessageDetailProps {
  message: Message | null;
  onClose: () => void;
}

export const MessageDetail = ({ message, onClose }: MessageDetailProps) => {
  const { t } = useLanguage();

  if (!message) {
    return (
      <Card className="h-[600px] relative">
        <ScrollArea className="h-full">
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
            <Send className="h-12 w-12 text-gray-300" />
            <p>{t('selectMessageToRead')}</p>
          </div>
        </ScrollArea>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] relative">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{message.subject}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{t('from')} {message.sender?.name}</span>
              <span>•</span>
              <span>{new Date(message.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-2" />
                {t('markImportant')}
              </Button>
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4 mr-2" />
                {t('archive')}
              </Button>
            </div>
          </div>
          <div className="prose max-w-none">
            {message.content}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};