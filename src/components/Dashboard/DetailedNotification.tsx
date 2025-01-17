import { formatDate } from "@/lib/utils";

interface DetailedNotificationProps {
  notification: {
    id: string;
    title: string;
    content: string;
    type: string;
    is_read: boolean;
    created_at: string;
    metadata: any;
    link?: string;
  };
}

export const DetailedNotification = ({ notification }: DetailedNotificationProps) => {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-medium ${!notification.is_read ? 'text-black' : 'text-gray-600'}`}>
          {notification.title}
        </h3>
        <span className="text-xs text-gray-500">
          {formatDate(notification.created_at)}
        </span>
      </div>
      <p className="text-sm text-gray-600">{notification.content}</p>
      {notification.metadata && Object.keys(notification.metadata).length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {Object.entries(notification.metadata).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium">{key}: </span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};