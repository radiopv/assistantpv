import { User, Star, Archive, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface MessageHeaderProps {
  sender: {
    name: string;
    role: string;
  };
  createdAt: string;
  onDelete: () => void;
  onStar: () => void;
  onArchive: () => void;
  isStarred: boolean;
  isArchived: boolean;
}

export const MessageHeader = ({ 
  sender, 
  createdAt, 
  onDelete, 
  onStar,
  onArchive,
  isStarred,
  isArchived
}: MessageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        <span className="font-semibold">{sender?.name}</span>
        <Badge variant={sender?.role === "admin" ? "destructive" : "secondary"}>
          {sender?.role}
        </Badge>
        {isStarred && (
          <Badge variant="warning">Important</Badge>
        )}
        {isArchived && (
          <Badge variant="secondary">Archivé</Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale: fr,
          })}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
            className={isStarred ? "text-yellow-500" : ""}
          >
            <Star className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onArchive();
            }}
          >
            <Archive className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};