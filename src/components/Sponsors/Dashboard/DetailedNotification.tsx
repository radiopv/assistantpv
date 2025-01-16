import { formatDistanceToNow } from "date-fns";
import { fr, es } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bell, Image, FileText, ListTodo } from "lucide-react";
import { Json } from "@/integrations/supabase/types/json";

interface DetailedNotificationProps {
  notification: {
    id: string;
    title: string;
    content: string;
    type: string;
    created_at: string;
    is_read?: boolean;
    metadata?: Json;
    link?: string;
  };
}

export const DetailedNotification = ({ notification }: DetailedNotificationProps) => {
  const { language } = useLanguage();
  const dateLocale = language === 'fr' ? fr : es;

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'photo_update':
        return <Image className="w-4 h-4 text-blue-500" />;
      case 'needs_update':
        return <ListTodo className="w-4 h-4 text-orange-500" />;
      case 'child_update':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderChanges = () => {
    if (!notification.metadata || typeof notification.metadata !== 'object') return null;

    const metadata = notification.metadata as {
      previous_state?: {
        description?: string;
        story?: string;
        needs?: any[];
        photo_url?: string;
      };
      new_state?: {
        description?: string;
        story?: string;
        needs?: any[];
        photo_url?: string;
      };
      changed_fields?: {
        description?: boolean;
        story?: boolean;
        needs?: boolean;
        photo?: boolean;
      };
    };

    return (
      <div className="mt-2 space-y-2 text-sm">
        {metadata.changed_fields?.description && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">Description :</p>
            <div className="grid gap-1">
              <div className="bg-red-50/50 p-1 rounded">
                <p className="text-xs text-red-700">Ancienne description :</p>
                <p className="text-xs">{metadata.previous_state?.description || "Aucune description"}</p>
              </div>
              <div className="bg-green-50/50 p-1 rounded">
                <p className="text-xs text-green-700">Nouvelle description :</p>
                <p className="text-xs">{metadata.new_state?.description}</p>
              </div>
            </div>
          </div>
        )}

        {metadata.changed_fields?.story && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">Histoire :</p>
            <div className="grid gap-1">
              <div className="bg-red-50/50 p-1 rounded">
                <p className="text-xs text-red-700">Ancienne histoire :</p>
                <p className="text-xs">{metadata.previous_state?.story || "Aucune histoire"}</p>
              </div>
              <div className="bg-green-50/50 p-1 rounded">
                <p className="text-xs text-green-700">Nouvelle histoire :</p>
                <p className="text-xs">{metadata.new_state?.story}</p>
              </div>
            </div>
          </div>
        )}

        {metadata.changed_fields?.needs && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">Besoins mis à jour</p>
            <div className="bg-blue-50/50 p-1 rounded">
              <p className="text-xs text-blue-700">Nouveaux besoins :</p>
              <ul className="list-disc list-inside text-xs">
                {metadata.new_state?.needs?.map((need: any, index: number) => (
                  <li key={index}>
                    {need.category} {need.is_urgent && "(Urgent!)"} 
                    {need.description && <span className="text-gray-600"> - {need.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {metadata.changed_fields?.photo && metadata.new_state?.photo_url && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">Nouvelle photo ajoutée :</p>
            <div className="relative w-24 h-24">
              <img
                src={metadata.new_state.photo_url}
                alt="Nouvelle photo"
                className="rounded object-cover w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
          <p className="text-xs text-gray-600 mt-0.5">{notification.content}</p>
          {renderChanges()}
          <div className="mt-1 text-xs text-gray-400">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: dateLocale
            })}
          </div>
        </div>
      </div>
    </div>
  );
};