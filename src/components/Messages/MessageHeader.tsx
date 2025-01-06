import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MessageHeaderProps {
  sender: {
    name: string;
    role: string;
  };
  createdAt: string;
  onDelete: () => void;
}

export const MessageHeader = ({ sender, createdAt, onDelete }: MessageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        <span className="font-semibold">{sender?.name}</span>
        <Badge variant={sender?.role === "admin" ? "destructive" : "secondary"}>
          {sender?.role}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale: fr,
          })}
        </span>
        <Button
          variant="destructive"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};