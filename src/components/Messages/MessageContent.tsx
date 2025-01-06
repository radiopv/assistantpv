import { Mail, MailOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MessageContentProps {
  subject: string;
  content: string;
  isRead: boolean;
}

export const MessageContent = ({ subject, content, isRead }: MessageContentProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {isRead ? (
          <MailOpen className="h-4 w-4 text-gray-400" />
        ) : (
          <Mail className="h-4 w-4 text-primary" />
        )}
        <h3 className="font-medium">{subject}</h3>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 pl-6">{content}</p>
      {!isRead && (
        <Badge className="ml-6" variant="default">
          Nouveau
        </Badge>
      )}
    </div>
  );
};